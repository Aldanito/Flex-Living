import { HostawayService } from "./hostaway";
import { GooglePlacesService, GoogleReview } from "./googlePlaces";
import Property, { IProperty } from "../models/Property";

export interface HybridReview {
  id: string;
  listingId: string;
  propertyName: string;
  propertyAddress: string;
  channel: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  reviewDate: string;
  category?: string;
  source: "hostaway" | "google";
  reviewerPhotoUrl?: string;
  reviewerUrl?: string;
  propertyId?: string;
}

export class HybridReviewsService {
  private hostawayService: HostawayService;
  private googlePlacesService: GooglePlacesService;
  private cache: { data: HybridReview[]; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.hostawayService = new HostawayService();
    this.googlePlacesService = new GooglePlacesService();
  }

  /**
   * Get all reviews by combining Hostaway listings with Google Places reviews
   */
  async getAllReviews(): Promise<HybridReview[]> {
    // Check cache first
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      console.log("📋 Returning cached reviews");
      return this.cache.data;
    }

    console.log("🔄 Starting hybrid reviews fetch...");

    try {
      // Step 1: Get approved properties from database
      const properties = await Property.find({
        approved: true,
        status: "approved",
      }).lean();

      console.log(`📋 Found ${properties.length} approved properties`);

      if (properties.length === 0) {
        console.log("ℹ️ No approved properties found, returning empty reviews");
        return [];
      }

      // Step 2: Get Hostaway reviews and listings (if any)
      const hostawayReviews = await this.hostawayService.fetchReviews(1000, 0);
      const hostawayListings = await this.hostawayService.getListings();
      console.log(`🏠 Found ${hostawayReviews.length} Hostaway reviews`);
      console.log(`🏠 Found ${hostawayListings.length} Hostaway listings`);

      // Step 3: Get Google reviews for our actual properties
      const googleReviews: HybridReview[] = [];

      try {
        console.log(`🔍 Getting Google reviews for properties...`);

        // Get reviews for each property
        for (const property of properties) {
          try {
            let placeDetails = null;
            let googlePlaceId = property.googlePlaceId;

            // If property has googlePlaceId, use it directly
            if (googlePlaceId) {
              console.log(
                `🔍 Getting Google reviews for: ${property.name} (${googlePlaceId})`
              );
              placeDetails = await this.googlePlacesService.getPlaceDetails(
                googlePlaceId
              );
            } else {
              // If no googlePlaceId, search for the property by address
              console.log(
                `🔍 Searching for Google Place for: ${property.name} at ${property.address}`
              );

              // Search for the property by address
              const searchResults = await this.googlePlacesService.searchPlaces(
                `${property.name} ${property.address}`
              );

              if (searchResults && searchResults.length > 0) {
                // Use the first result
                const place = searchResults[0];
                googlePlaceId = place.place_id;
                console.log(
                  `📍 Found Google Place: ${place.name} (${googlePlaceId})`
                );

                // Get detailed reviews for this place
                placeDetails = await this.googlePlacesService.getPlaceDetails(
                  googlePlaceId!
                );
              } else {
                console.log(
                  `ℹ️ No Google Place found for ${property.name} at ${property.address}`
                );
              }
            }

            if (placeDetails && placeDetails.reviews && googlePlaceId) {
              console.log(
                `⭐ Found ${placeDetails.reviews.length} Google reviews for ${property.name}`
              );

              // Transform Google reviews to our format
              const transformedReviews = placeDetails.reviews.map(
                (review, index) => ({
                  id: `google_${googlePlaceId}_${index}`,
                  listingId: googlePlaceId,
                  propertyName: property.name,
                  propertyAddress: property.address,
                  channel: "Google",
                  rating: review.rating,
                  reviewText: review.text || "",
                  reviewerName: review.author_name,
                  reviewDate: new Date(review.time * 1000).toISOString(),
                  category: "Accommodation",
                  source: "google" as const,
                  reviewerPhotoUrl: review.profile_photo_url,
                  reviewerUrl: review.author_url,
                  propertyId: property._id.toString(), // Use our actual property ID
                })
              );

              googleReviews.push(...transformedReviews);
            } else {
              console.log(`ℹ️ No Google reviews found for ${property.name}`);
            }
          } catch (error) {
            console.error(
              `❌ Error fetching Google reviews for ${property.name}:`,
              error
            );
            // Continue with other properties
          }
        }
      } catch (error) {
        console.error(`❌ Error in Google Places reviews fetch:`, error);
      }

      console.log(`🌐 Total Google reviews found: ${googleReviews.length}`);

      // Step 4: Transform Hostaway reviews to our format
      const transformedHostawayReviews: HybridReview[] = hostawayReviews.map(
        (review, index) => {
          // First try to find property in our database
          const property = properties.find(
            (p: any) => p.hostawayListingId === review.listingId
          );

          // If not found in database, try to find in Hostaway listings
          const hostawayListing = hostawayListings.find(
            (listing: any) => listing.id.toString() === review.listingId
          );

          return {
            id: `hostaway_${review.id || index}`,
            listingId: review.listingId,
            propertyName:
              property?.name || hostawayListing?.name || "Unknown Property",
            propertyAddress:
              property?.address ||
              hostawayListing?.address ||
              "Unknown Address",
            channel: "Hostaway",
            rating: review.rating,
            reviewText: review.reviewText,
            reviewerName: review.reviewerName,
            reviewDate: review.reviewDate,
            category: review.category,
            source: "hostaway" as const,
            propertyId:
              property?._id.toString() || `hostaway_${review.listingId}`,
          };
        }
      );

      // Step 5: Combine all reviews
      const allReviews = [...transformedHostawayReviews, ...googleReviews];

      console.log(
        `✅ Hybrid reviews fetch complete: ${allReviews.length} total reviews`
      );
      console.log(`   - Hostaway: ${transformedHostawayReviews.length}`);
      console.log(`   - Google: ${googleReviews.length}`);

      // Cache the results
      this.cache = {
        data: allReviews,
        timestamp: Date.now(),
      };

      return allReviews;
    } catch (error) {
      console.error("❌ Error in hybrid reviews fetch:", error);
      return [];
    }
  }

  /**
   * Get reviews for a specific property
   */
  async getReviewsForProperty(propertyId: string): Promise<HybridReview[]> {
    const allReviews = await this.getAllReviews();
    return allReviews.filter((review) => review.propertyId === propertyId);
  }

  /**
   * Get reviews by source
   */
  async getReviewsBySource(
    source: "hostaway" | "google"
  ): Promise<HybridReview[]> {
    const allReviews = await this.getAllReviews();
    return allReviews.filter((review) => review.source === source);
  }

  /**
   * Get reviews statistics
   */
  async getReviewsStats(): Promise<{
    totalReviews: number;
    hostawayReviews: number;
    googleReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
    reviewsByProperty: { [key: string]: number };
  }> {
    const allReviews = await this.getAllReviews();

    const hostawayReviews = allReviews.filter(
      (r) => r.source === "hostaway"
    ).length;
    const googleReviews = allReviews.filter(
      (r) => r.source === "google"
    ).length;

    const totalRating = allReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      allReviews.length > 0 ? totalRating / allReviews.length : 0;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allReviews.forEach((review) => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    const reviewsByProperty: { [key: string]: number } = {};
    allReviews.forEach((review) => {
      const propertyId = review.propertyId || review.listingId;
      reviewsByProperty[propertyId] = (reviewsByProperty[propertyId] || 0) + 1;
    });

    return {
      totalReviews: allReviews.length,
      hostawayReviews,
      googleReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      reviewsByProperty,
    };
  }
}
