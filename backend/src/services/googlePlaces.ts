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

    this.api = axios.create({
      baseURL: "https://maps.googleapis.com/maps/api/place",
      params: {
        key: this.apiKey,
      },
    });
  }

  async searchPlaces(query: string): Promise<any[]> {
    try {
      if (!this.apiKey) {
        throw new Error("Google Places API key not configured");
      }

      const response = await this.api.get("/textsearch/json", {
        params: {
          query,
          type: "lodging",
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

      throw error;
    }
  }

  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    try {
      if (!this.apiKey) {
        throw new Error("Google Places API key not configured");
      }

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

      throw error;
    }
  }

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

  async searchFlexLivingReviews(): Promise<GoogleReview[]> {
    try {

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

                const listingId = `google_${place.place_id}`;
                const reviews = this.normalizeReviews(placeDetails, listingId);
                allReviews.push(...reviews);

              }

              await this.delay(100);
            } catch (placeError) {

            }
          }

          await this.delay(200);
        } catch (searchError) {

        }
      }

      return allReviews;
    } catch (error) {

      throw error;
    }
  }

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
