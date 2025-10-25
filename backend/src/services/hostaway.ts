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

    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken!;
    }

    try {

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

      this.tokenExpiry =
        Date.now() + ((response.data as any).expires_in - 3600) * 1000;

      return this.accessToken!;
    } catch (error: any) {

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

      let response: HostawayApiResponse;

      try {

        response = await this.makeAuthenticatedRequest("/listings", {
          limit,
          offset,
        });

        if (response.status === "success" && response.result) {

          const listings = response.result;

          const reviews: any[] = [];

          for (const listing of listings) {
            if (listing.reviews && Array.isArray(listing.reviews)) {
              reviews.push(...listing.reviews);
            }
          }

          if (reviews.length > 0) {

            const normalizedReviews = this.normalizeReviews(reviews);
            await this.saveReviewsToFile(normalizedReviews);
            return normalizedReviews;
          } else {

          }
        }
      } catch (listingsError) {

      }

      response = await this.makeAuthenticatedRequest("/reviews", {
        limit,
        offset,
      });

      if (response.status !== "success") {
        throw new Error(`Hostaway API error: ${response.result}`);
      }

      const reviews = this.normalizeReviews(response.result || []);

      await this.saveReviewsToFile(reviews);

      return reviews;
    } catch (error) {

      try {
        const cachedReviews = await this.loadReviewsFromFile();

        return cachedReviews;
      } catch (cacheError) {

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

    } catch (error) {

    }
  }

  private async loadReviewsFromFile(): Promise<HostawayReview[]> {
    try {
      const filePath = path.join(__dirname, "../../data/hostaway-reviews.json");
      const data = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(data);

      const lastUpdated = new Date(parsed.lastUpdated);
      const now = new Date();
      const hoursDiff =
        (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > 24) {

      }

      return parsed.reviews || [];
    } catch (error) {

      throw error;
    }
  }

  async getListings(): Promise<any[]> {
    try {

      const response: HostawayApiResponse = await this.makeAuthenticatedRequest(
        "/listings?attachObjects[]=bookingEngineUrls&attachObjects[]=pictures&attachObjects[]=amenities&attachObjects[]=reviews"
      );

      if (response.status !== "success") {
        throw new Error(`Hostaway API error: ${response.result}`);
      }

      if (response.result && response.result.length > 0) {
        const firstListing = response.result[0];

      }

      return response.result || [];
    } catch (error) {

      throw error;
    }
  }

  async getListing(id: string): Promise<any> {
    try {

      const response: HostawayApiResponse = await this.makeAuthenticatedRequest(
        `/listings/${id}?attachObjects[]=bookingEngineUrls&attachObjects[]=pictures&attachObjects[]=amenities&attachObjects[]=reviews`
      );

      if (response.status !== "success") {
        throw new Error(`Hostaway API error: ${response.result}`);
      }

      return response.result;
    } catch (error) {

      throw error;
    }
  }

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

    if (
      hostawayListing.listingAmenities &&
      Array.isArray(hostawayListing.listingAmenities)
    ) {

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

    else if (hostawayListing.amenities) {

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

    if (
      hostawayListing.listingImages &&
      Array.isArray(hostawayListing.listingImages)
    ) {

      hostawayListing.listingImages
        .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .forEach((image: any) => {
          if (image.url) {
            images.push(image.url);
          }
        });
    }

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
