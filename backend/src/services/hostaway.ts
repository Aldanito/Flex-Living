import axios from "axios";
import fs from "fs/promises";
import path from "path";

export interface HostawayReview {
  id: string;
  listingId: string;
  channel: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  reviewDate: string;
  category?: string;
  source: "hostaway";
}

export interface HostawayApiResponse {
  status: string;
  result: any;
  limit?: number;
  offset?: number;
  count?: number;
  page?: number;
  totalPages?: number;
}

export class HostawayService {
  private api: any;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.api = axios.create({
      baseURL: "https://api.hostaway.com/v1",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken!;
    }

    try {
      // Based on Hostaway API documentation, we need to use client_credentials grant
      // with application/x-www-form-urlencoded content type
      const params = new URLSearchParams();
      params.append("grant_type", "client_credentials");
      params.append("client_id", process.env.HOSTAWAY_ACCOUNT_ID || "");
      params.append("client_secret", process.env.HOSTAWAY_API_KEY || "");
      params.append("scope", "general");

      const response = await axios.post(
        "https://api.hostaway.com/v1/accessTokens",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
          },
        }
      );

      this.accessToken = (response.data as any).access_token;
      // Set expiry to 1 hour before actual expiry for safety
      this.tokenExpiry =
        Date.now() + ((response.data as any).expires_in - 3600) * 1000;

      console.log("✅ Hostaway access token obtained successfully");
      console.log("🔑 Token details:", {
        token: this.accessToken?.substring(0, 20) + "...",
        expiresIn: (response.data as any).expires_in,
        tokenType: (response.data as any).token_type,
        scope: (response.data as any).scope,
      });
      return this.accessToken!;
    } catch (error: any) {
      console.error("Failed to get Hostaway access token:", error);
      console.error("Error details:", error.response?.data);
      throw new Error("Failed to authenticate with Hostaway API");
    }
  }

  private async makeAuthenticatedRequest(
    endpoint: string,
    params: any = {}
  ): Promise<any> {
    const token = await this.getAccessToken();

    try {
      const response = await this.api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired, try to refresh
        this.accessToken = null;
        this.tokenExpiry = 0;
        const newToken = await this.getAccessToken();

        const retryResponse = await this.api.get(endpoint, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
          params,
        });

        return retryResponse.data;
      }

      throw error;
    }
  }

  async fetchReviews(
    limit: number = 100,
    offset: number = 0
  ): Promise<HostawayReview[]> {
    try {
      console.log(
        `Fetching Hostaway reviews: limit=${limit}, offset=${offset}`
      );

      // Try to fetch listings first, as reviews might be part of listings
      let response: HostawayApiResponse;

      try {
        // First try the listings endpoint
        response = await this.makeAuthenticatedRequest("/listings", {
          limit,
          offset,
        });

        if (response.status === "success" && response.result) {
          // Extract reviews from listings if they exist
          const listings = response.result;
          console.log("📋 Hostaway listings response:", {
            status: response.status,
            totalListings: listings.length,
            listings: listings.map((l: any) => ({
              id: l.id,
              name: l.name,
              address: l.address,
              city: l.city,
              bedrooms: l.bedroomsNumber,
              bathrooms: l.bathroomsNumber,
              maxGuests: l.personCapacity,
              hasReviews: l.reviews && Array.isArray(l.reviews),
            })),
          });

          const reviews: any[] = [];

          // Check if listings have reviews data
          for (const listing of listings) {
            if (listing.reviews && Array.isArray(listing.reviews)) {
              reviews.push(...listing.reviews);
            }
          }

          if (reviews.length > 0) {
            console.log("📝 Found reviews in listings:", reviews.length);
            const normalizedReviews = this.normalizeReviews(reviews);
            await this.saveReviewsToFile(normalizedReviews);
            return normalizedReviews;
          } else {
            console.log("ℹ️ No reviews found in listings data");
          }
        }
      } catch (listingsError) {
        console.log("Listings endpoint failed, trying reviews endpoint...");
      }

      // If listings don't have reviews, try the reviews endpoint directly
      response = await this.makeAuthenticatedRequest("/reviews", {
        limit,
        offset,
      });

      if (response.status !== "success") {
        throw new Error(`Hostaway API error: ${response.result}`);
      }

      const reviews = this.normalizeReviews(response.result || []);

      // Save to JSON file for caching
      await this.saveReviewsToFile(reviews);

      return reviews;
    } catch (error) {
      console.error("Error fetching Hostaway reviews:", error);

      // If API fails, try to return cached data
      try {
        const cachedReviews = await this.loadReviewsFromFile();
        console.log("Returning cached reviews due to API error");
        return cachedReviews;
      } catch (cacheError) {
        console.error("Failed to load cached reviews:", cacheError);
        console.log("No reviews available - returning empty array");
        return [];
      }
    }
  }

  private normalizeReviews(rawReviews: any[]): HostawayReview[] {
    return rawReviews.map((review: any) => ({
      id: review.id?.toString() || `hostaway_${Date.now()}_${Math.random()}`,
      listingId: review.listingId?.toString() || "unknown",
      channel: review.channel || "hostaway",
      rating: this.parseRating(review.rating),
      reviewText: review.reviewText || review.comment || "",
      reviewerName: review.reviewerName || review.guestName || "Anonymous",
      reviewDate:
        review.reviewDate || review.createdAt || new Date().toISOString(),
      category: review.category || "general",
      source: "hostaway" as const,
    }));
  }

  private parseRating(rating: any): number {
    if (typeof rating === "number") {
      return Math.max(1, Math.min(5, rating));
    }

    if (typeof rating === "string") {
      const parsed = parseFloat(rating);
      if (!isNaN(parsed)) {
        return Math.max(1, Math.min(5, parsed));
      }
    }

    // Default to 5 if rating is invalid
    return 5;
  }

  private async saveReviewsToFile(reviews: HostawayReview[]): Promise<void> {
    try {
      const dataDir = path.join(__dirname, "../../data");
      await fs.mkdir(dataDir, { recursive: true });

      const filePath = path.join(dataDir, "hostaway-reviews.json");
      const data = {
        lastUpdated: new Date().toISOString(),
        reviews,
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(`Saved ${reviews.length} reviews to ${filePath}`);
    } catch (error) {
      console.error("Failed to save reviews to file:", error);
    }
  }

  private async loadReviewsFromFile(): Promise<HostawayReview[]> {
    try {
      const filePath = path.join(__dirname, "../../data/hostaway-reviews.json");
      const data = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(data);

      // Check if data is less than 24 hours old
      const lastUpdated = new Date(parsed.lastUpdated);
      const now = new Date();
      const hoursDiff =
        (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        console.log("Cached reviews are older than 24 hours");
      }

      return parsed.reviews || [];
    } catch (error) {
      console.error("Failed to load reviews from file:", error);
      throw error; // Re-throw the error so the fallback to mock data works
    }
  }

  async getListings(): Promise<any[]> {
    try {
      // Use attachObjects[] parameter to get additional data
      const response: HostawayApiResponse = await this.makeAuthenticatedRequest(
        "/listings?attachObjects[]=bookingEngineUrls&attachObjects[]=pictures&attachObjects[]=amenities&attachObjects[]=reviews"
      );

      if (response.status !== "success") {
        throw new Error(`Hostaway API error: ${response.result}`);
      }

      // Debug: Log the raw response structure
      console.log("🔍 Raw Hostaway listings response structure:");
      if (response.result && response.result.length > 0) {
        const firstListing = response.result[0];
        console.log("📋 First listing keys:", Object.keys(firstListing));
        console.log("🏠 First listing amenities:", firstListing.amenities);
        console.log(
          "🏠 First listing listingAmenities:",
          firstListing.listingAmenities
        );
        console.log("📸 First listing pictures:", firstListing.pictures);
        console.log("📸 First listing photos:", firstListing.photos);
        console.log(
          "📸 First listing listingImages:",
          firstListing.listingImages
        );
        console.log(
          "🔗 First listing bookingEngineUrls:",
          firstListing.bookingEngineUrls
        );
        console.log(
          "🛏️ Bedrooms (bedroomsNumber):",
          firstListing.bedroomsNumber
        );
        console.log(
          "🚿 Bathrooms (bathroomsNumber):",
          firstListing.bathroomsNumber
        );
        console.log(
          "👥 Max Guests (personCapacity):",
          firstListing.personCapacity
        );
      }

      return response.result || [];
    } catch (error) {
      console.error("Error fetching Hostaway listings:", error);
      throw error;
    }
  }

  async getListing(id: string): Promise<any> {
    try {
      // Use attachObjects[] parameter to get additional data for individual listing
      const response: HostawayApiResponse = await this.makeAuthenticatedRequest(
        `/listings/${id}?attachObjects[]=bookingEngineUrls&attachObjects[]=pictures&attachObjects[]=amenities&attachObjects[]=reviews`
      );

      if (response.status !== "success") {
        throw new Error(`Hostaway API error: ${response.result}`);
      }

      return response.result;
    } catch (error) {
      console.error(`Error fetching Hostaway listing ${id}:`, error);
      throw error;
    }
  }

  // Transform Hostaway listing data to Property model format
  transformHostawayListingToProperty(hostawayListing: any): any {
    return {
      name: hostawayListing.name || "Unnamed Property",
      hostawayListingId: hostawayListing.id?.toString(),
      address: hostawayListing.address || "Address not provided",
      city: hostawayListing.city || "Unknown City",
      description: hostawayListing.description || "",
      bedrooms: hostawayListing.bedroomsNumber || 1,
      bathrooms: hostawayListing.bathroomsNumber || 1,
      maxGuests: hostawayListing.personCapacity || 2,
      size: hostawayListing.squareMeters || 50,
      pricePerNight: hostawayListing.price || null,
      pricePerMonth: hostawayListing.monthlyPrice || null,
      amenities: this.extractAmenities(hostawayListing),
      images: this.extractImages(hostawayListing),
      propertyType: hostawayListing.propertyType || "Apartment",
      minimumStay: hostawayListing.minimumStay || 1,
      features: this.extractFeatures(hostawayListing),
      nearbyTransport: [],
      approved: false,
      status: "pending",
    };
  }

  private extractAmenities(hostawayListing: any): string[] {
    const amenities: string[] = [];

    // Check for listingAmenities array (new format with attachObjects[])
    if (
      hostawayListing.listingAmenities &&
      Array.isArray(hostawayListing.listingAmenities)
    ) {
      // Map amenity IDs to names based on Hostaway's amenity system
      const amenityIdMap: { [key: number]: string } = {
        1: "WiFi",
        2: "Kitchen",
        3: "Washing Machine",
        4: "Dryer",
        5: "Air Conditioning",
        6: "Heating",
        7: "Parking",
        8: "Elevator",
        9: "Balcony",
        10: "Garden",
        11: "Pool",
        12: "Gym",
        13: "TV",
        14: "Cable TV",
        15: "Dishwasher",
        16: "Microwave",
        17: "Refrigerator",
        18: "Coffee Maker",
        19: "Iron",
        20: "Hair Dryer",
        21: "Smoke Detector",
        22: "Carbon Monoxide Detector",
        23: "Hot Tub",
        24: "Fireplace",
        25: "BBQ Grill",
        26: "Patio",
        27: "Deck",
        28: "Terrace",
        29: "Rooftop",
        30: "Sauna",
        31: "Steam Room",
        32: "Tennis Court",
        33: "Basketball Court",
        34: "Table Tennis",
        35: "Pool Table",
        36: "Darts",
        37: "Board Games",
        38: "Books",
        39: "Toys",
        40: "High Chair",
        41: "Baby Crib",
        42: "Baby Monitor",
        43: "Changing Table",
        44: "Baby Bath",
        45: "Stroller",
        46: "Car Seat",
        47: "Pet Friendly",
        48: "Dog Friendly",
        49: "Cat Friendly",
        50: "Wheelchair Accessible",
      };

      hostawayListing.listingAmenities.forEach((amenity: any) => {
        if (amenity.amenityId && amenityIdMap[amenity.amenityId]) {
          amenities.push(amenityIdMap[amenity.amenityId]);
        }
      });
    }
    // Fallback to old format
    else if (hostawayListing.amenities) {
      // Map Hostaway amenities to our format
      const amenityMap: { [key: string]: string } = {
        wifi: "WiFi",
        internet: "Internet",
        kitchen: "Kitchen",
        washing_machine: "Washing Machine",
        dryer: "Dryer",
        air_conditioning: "Air Conditioning",
        heating: "Heating",
        parking: "Parking",
        elevator: "Elevator",
        balcony: "Balcony",
        garden: "Garden",
        pool: "Pool",
        gym: "Gym",
        tv: "TV",
        cable_tv: "Cable TV",
        dishwasher: "Dishwasher",
        microwave: "Microwave",
        refrigerator: "Refrigerator",
        coffee_maker: "Coffee Maker",
        iron: "Iron",
        hair_dryer: "Hair Dryer",
        smoke_detector: "Smoke Detector",
        carbon_monoxide_detector: "Carbon Monoxide Detector",
      };

      if (Array.isArray(hostawayListing.amenities)) {
        hostawayListing.amenities.forEach((amenity: any) => {
          const amenityName =
            typeof amenity === "string" ? amenity : amenity.name;
          if (amenityName && amenityMap[amenityName.toLowerCase()]) {
            amenities.push(amenityMap[amenityName.toLowerCase()]);
          }
        });
      }
    }

    return amenities;
  }

  private extractImages(hostawayListing: any): string[] {
    const images: string[] = [];

    // Check for listingImages array (new format with attachObjects[])
    if (
      hostawayListing.listingImages &&
      Array.isArray(hostawayListing.listingImages)
    ) {
      // Sort by sortOrder and extract URLs
      hostawayListing.listingImages
        .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .forEach((image: any) => {
          if (image.url) {
            images.push(image.url);
          }
        });
    }
    // Fallback to old formats
    else if (hostawayListing.photos && Array.isArray(hostawayListing.photos)) {
      hostawayListing.photos.forEach((photo: any) => {
        if (photo.url) {
          images.push(photo.url);
        }
      });
    } else if (
      hostawayListing.pictures &&
      Array.isArray(hostawayListing.pictures)
    ) {
      hostawayListing.pictures.forEach((picture: any) => {
        if (picture.url) {
          images.push(picture.url);
        }
      });
    }

    return images;
  }

  private extractFeatures(hostawayListing: any): string[] {
    const features: string[] = [];

    // Add basic features based on property data
    if (hostawayListing.bedrooms > 0) {
      features.push(
        `${hostawayListing.bedrooms} Bedroom${
          hostawayListing.bedrooms > 1 ? "s" : ""
        }`
      );
    }
    if (hostawayListing.bathrooms > 0) {
      features.push(
        `${hostawayListing.bathrooms} Bathroom${
          hostawayListing.bathrooms > 1 ? "s" : ""
        }`
      );
    }
    if (hostawayListing.accommodates > 0) {
      features.push(`Up to ${hostawayListing.accommodates} guests`);
    }
    if (hostawayListing.squareMeters) {
      features.push(`${hostawayListing.squareMeters} m²`);
    }

    return features;
  }
}
