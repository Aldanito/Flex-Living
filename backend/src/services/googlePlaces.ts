import axios from "axios";

export interface GoogleReview {
  id: string;
  listingId: string;
  channel: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  reviewDate: string;
  category?: string;
  source: "google";
  reviewerPhotoUrl?: string;
  reviewerUrl?: string;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GooglePlaceReview[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface GooglePlaceReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export class GooglePlacesService {
  private api: any;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || "";
    console.log("Google Places API Key loaded:", this.apiKey ? "YES" : "NO");
    console.log(
      "API Key value:",
      this.apiKey ? `${this.apiKey.substring(0, 10)}...` : "undefined"
    );
    this.api = axios.create({
      baseURL: "https://maps.googleapis.com/maps/api/place",
      params: {
        key: this.apiKey,
      },
    });
  }

  /**
   * Search for places by text query
   * This is useful for finding properties by name or address
   */
  async searchPlaces(query: string): Promise<any[]> {
    try {
      if (!this.apiKey) {
        throw new Error("Google Places API key not configured");
      }

      console.log(`Searching Google Places for: ${query}`);

      const response = await this.api.get("/textsearch/json", {
        params: {
          query,
          type: "lodging", // Focus on accommodation types
        },
      });

      if (
        response.data.status !== "OK" &&
        response.data.status !== "ZERO_RESULTS"
      ) {
        throw new Error(
          `Google Places API error: ${response.data.status} - ${response.data.error_message}`
        );
      }

      return response.data.results || [];
    } catch (error) {
      console.error("Error searching Google Places:", error);
      throw error;
    }
  }

  /**
   * Get detailed information about a place including reviews
   * This is the main method to fetch reviews for a specific property
   */
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    try {
      if (!this.apiKey) {
        throw new Error("Google Places API key not configured");
      }

      console.log(`Fetching Google Place details for: ${placeId}`);

      const response = await this.api.get("/details/json", {
        params: {
          place_id: placeId,
          fields:
            "place_id,name,rating,user_ratings_total,reviews,formatted_address,geometry",
        },
      });

      if (response.data.status !== "OK") {
        throw new Error(
          `Google Places API error: ${response.data.status} - ${response.data.error_message}`
        );
      }

      return response.data.result;
    } catch (error) {
      console.error("Error fetching place details:", error);
      throw error;
    }
  }

  /**
   * Convert Google Place reviews to our normalized format
   */
  normalizeReviews(
    placeDetails: GooglePlaceDetails,
    listingId: string
  ): GoogleReview[] {
    if (!placeDetails.reviews || placeDetails.reviews.length === 0) {
      return [];
    }

    return placeDetails.reviews.map((review, index) => ({
      id: `google_${placeDetails.place_id}_${review.time}_${index}`,
      listingId,
      channel: "google",
      rating: review.rating,
      reviewText: review.text || "",
      reviewerName: review.author_name || "Anonymous",
      reviewDate: new Date(review.time * 1000).toISOString(),
      category: "general",
      source: "google" as const,
      reviewerPhotoUrl: review.profile_photo_url,
      reviewerUrl: review.author_url,
    }));
  }

  /**
   * Search for Flex Living properties and fetch their reviews
   * This method attempts to find properties that might be Flex Living listings
   */
  async searchFlexLivingReviews(): Promise<GoogleReview[]> {
    try {
      console.log("Searching for Flex Living properties on Google Places...");

      // Search terms that might match Flex Living properties
      const searchTerms = [
        "Flex Living London",
        "The Flex London",
        "Flex Living furnished apartments",
        "The Flex furnished apartments London",
      ];

      const allReviews: GoogleReview[] = [];

      for (const searchTerm of searchTerms) {
        try {
          const places = await this.searchPlaces(searchTerm);

          for (const place of places) {
            try {
              const placeDetails = await this.getPlaceDetails(place.place_id);

              if (placeDetails && placeDetails.reviews) {
                // Use a generic listing ID since we don't have direct mapping
                const listingId = `google_${place.place_id}`;
                const reviews = this.normalizeReviews(placeDetails, listingId);
                allReviews.push(...reviews);

                console.log(
                  `Found ${reviews.length} reviews for ${placeDetails.name}`
                );
              }

              // Add delay to respect rate limits
              await this.delay(100);
            } catch (placeError) {
              console.error(
                `Error fetching details for place ${place.place_id}:`,
                placeError
              );
            }
          }

          // Add delay between search terms
          await this.delay(200);
        } catch (searchError) {
          console.error(`Error searching for "${searchTerm}":`, searchError);
        }
      }

      console.log(`Total Google reviews found: ${allReviews.length}`);
      return allReviews;
    } catch (error) {
      console.error("Error searching Flex Living reviews:", error);
      throw error;
    }
  }

  /**
   * Test the Google Places API connection
   */
  async testConnection(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          message: "Google Places API key not configured",
        };
      }

      // Test with a simple search
      const response = await this.api.get("/textsearch/json", {
        params: {
          query: "London hotel",
          type: "lodging",
        },
      });

      return {
        success: true,
        message: "Google Places API connection successful",
        details: {
          status: response.data.status,
          resultsCount: response.data.results?.length || 0,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Google Places API connection failed: ${error.message}`,
        details: error.response?.data,
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
