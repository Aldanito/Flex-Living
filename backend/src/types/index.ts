export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  reviews: GoogleReview[];
  rating: number;
  user_ratings_total: number;
}

export interface NormalizedReview {
  source: "hostaway" | "google";
  sourceId: string;
  listingId?: string;
  listingName: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  categories?: ReviewCategory[];
  channel?: string;
  submittedAt: Date;
  status: "pending" | "approved" | "rejected";
  isPublic: boolean;
  placeId?: string;
  address?: string;
}

export interface Property {
  name: string;
  hostawayId?: string;
  hostawayListingId?: string;
  googlePlaceId?: string;
  address: string;
  city: string;
  arrondissement?: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  size: number; // in square meters
  pricePerNight?: number;
  pricePerMonth?: number;
  amenities: string[];
  images: string[];
  propertyType: string; // Studio, Apartment, Loft, etc.
  availableFrom?: Date;
  minimumStay: number; // in days
  features: string[];
  nearbyTransport: string[];
  approved: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalReviews: number;
  averageRating: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  reviewsBySource: {
    hostaway: number;
    google: number;
  };
  reviewsByProperty: Array<{
    propertyName: string;
    totalReviews: number;
    averageRating: number;
  }>;
  recentReviews: NormalizedReview[];
}
