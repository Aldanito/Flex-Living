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
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  constructor() {
    this.hostawayService = new HostawayService();
    this.googlePlacesService = new GooglePlacesService();
  }

  async getAllReviews(): Promise<HybridReview[]> {

    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {

      return this.cache.data;
    }

    try {

      const properties = await Property.find({
        approved: true,
        status: "approved",
      }).lean();

      if (properties.length === 0) {

        return [];
      }

      const hostawayReviews = await this.hostawayService.fetchReviews(1000, 0);
      const hostawayListings = await this.hostawayService.getListings();

      const googleReviews: HybridReview[] = [];

      try {

        for (const property of properties) {
          try {
            let placeDetails = null;
            let googlePlaceId = property.googlePlaceId;

            if (googlePlaceId) {

              placeDetails = await this.googlePlacesService.getPlaceDetails(
                googlePlaceId
              );
            } else {

              const searchResults = await this.googlePlacesService.searchPlaces(
                `${property.name} ${property.address}`
              );

              if (searchResults && searchResults.length > 0) {

                const place = searchResults[0];
                googlePlaceId = place.place_id;

                placeDetails = await this.googlePlacesService.getPlaceDetails(
                  googlePlaceId!
                );
              } else {

              }
            }

            if (placeDetails && placeDetails.reviews && googlePlaceId) {

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
                  propertyId: property._id.toString(),
                })
              );

              googleReviews.push(...transformedReviews);
            } else {

            }
          } catch (error) {

          }
        }
      } catch (error) {

      }

      const transformedHostawayReviews: HybridReview[] = hostawayReviews.map(
        (review, index) => {

          const property = properties.find(
            (p: any) => p.hostawayListingId === review.listingId
          );

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

      const allReviews = [...transformedHostawayReviews, ...googleReviews];

      this.cache = {
        data: allReviews,
        timestamp: Date.now(),
      };

      return allReviews;
    } catch (error) {

      return [];
    }
  }

  async getReviewsForProperty(propertyId: string): Promise<HybridReview[]> {
    const allReviews = await this.getAllReviews();
    return allReviews.filter((review) => review.propertyId === propertyId);
  }

  async getReviewsBySource(
    source: "hostaway" | "google"
  ): Promise<HybridReview[]> {
    const allReviews = await this.getAllReviews();
    return allReviews.filter((review) => review.source === source);
  }

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
