export interface User {
  id: string;
  email: string;
  role: "manager" | "admin";
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Review {
  id: string;
  listingId: string;
  propertyName?: string;
  propertyAddress?: string;
  propertyId?: string;
  channel: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  reviewDate: string;
  category?: string;
  source: "hostaway" | "google";
  reviewerPhotoUrl?: string;
  reviewerUrl?: string;
  approval?: {
    isApproved: boolean;
    approvedBy: string | null;
    approvedAt: string | null;
  };
  // Additional properties for UI components
  approved?: boolean;
  guestName?: string;
  createdAt?: string;
  comment?: string;
  status?: "pending" | "approved" | "rejected";
  listingName?: string;
  submittedAt?: string;
  categories?: string[];
  isPublic?: boolean;
  _id?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ListingReviewsResponse {
  reviews: Review[];
  total: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  limit: number;
  offset: number;
}

export interface DashboardStats {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  averageRating: number;
  hostawayReviews: number;
  googleReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  channelDistribution: { [key: string]: number };
  listingStats: { [key: string]: { count: number; avgRating: number } };
  lastUpdated: string;
}

export interface ReviewFilters {
  listingId?: string;
  source?: "hostaway" | "google";
  rating?: number;
  channel?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
  // Additional properties for UI components
  page?: number;
  status?: "pending" | "approved" | "rejected";
  property?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GooglePlace {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface GooglePlacesResponse {
  message: string;
  query?: string;
  results: GooglePlace[];
  count: number;
}

export interface GooglePlaceDetailsResponse {
  message: string;
  place: {
    placeId: string;
    name: string;
    rating: number;
    totalRatings: number;
    address: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  reviews: Review[];
  reviewCount: number;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
  description: string;
  basePrice: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyPerformance {
  listingId: string;
  totalReviews: number;
  averageRating: number;
  performance: string;
}
