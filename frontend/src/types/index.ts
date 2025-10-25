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

export interface RawReview {
  id?: string;
  review_id?: string;
  _id?: string;
  listingId?: string;
  listing_id?: string;
  property_id?: string;
  channel?: string;
  platform?: string;
  rating?: number | string;
  score?: number | string;
  stars?: number | string;
  reviewText?: string;
  text?: string;
  comment?: string;
  content?: string;
  reviewerName?: string;
  author?: string;
  user_name?: string;
  name?: string;
  reviewDate?: string;
  date?: string;
  created_at?: string;
  timestamp?: string;
  category?: string;
  type?: string;
  source?: string;
  origin?: string;
  reviewerPhotoUrl?: string;
  avatar?: string;
  profile_picture?: string;
  reviewerUrl?: string;
  profile_url?: string;
  link?: string;
  approval?: {
    isApproved?: boolean;
    approvedBy?: string | null;
    approvedAt?: string | null;
  };
  status?: string;
}

export interface RawApproval {
  isApproved?: boolean;
  approvedBy?: string | null;
  approvedAt?: string | null;
  status?: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface TrendData {
  month: string;
  count: number;
  averageRating: number;
  reviews: Review[];
}

export interface RawDashboardStats {
  totalReviews?: number;
  total_reviews?: number;
  approvedReviews?: number;
  approved_reviews?: number;
  pendingReviews?: number;
  pending_reviews?: number;
  averageRating?: number;
  avg_rating?: number;
  ratingDistribution?: Record<string, number>;
  rating_distribution?: Record<string, number>;
  channelDistribution?: Record<string, number>;
  channel_distribution?: Record<string, number>;
  listingStats?: Record<string, { count: number; avgRating: number }>;
  listing_stats?: Record<string, { count: number; avg_rating: number }>;
  hostawayReviews?: number;
  hostaway_reviews?: number;
  googleReviews?: number;
  google_reviews?: number;
  lastUpdated?: string;
  last_updated?: string;
}
