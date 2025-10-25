import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import type {
  AuthResponse,
  ReviewsResponse,
  ListingReviewsResponse,
  DashboardStats,
  ReviewFilters,
  GooglePlacesResponse,
  GooglePlaceDetailsResponse,
} from "../types/index";

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL =
      import.meta.env.VITE_API_URL ||
      "https://flexbackend-production.up.railway.app/api";

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              const response = await axios.post(
                `${this.baseURL}/auth/refresh`,
                {
                  refreshToken,
                }
              );

              const { accessToken } = response.data;
              localStorage.setItem("accessToken", accessToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );
    return response.data;
  }

  async register(
    email: string,
    password: string,
    role: string = "manager"
  ): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post(
      "/auth/register",
      {
        email,
        password,
        role,
      }
    );
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get("/auth/me");
    return response.data;
  }

  async getReviews(filters: ReviewFilters = {}): Promise<ReviewsResponse> {
    const params = { ...filters };
    if (params.offset !== undefined && params.page === undefined) {
      params.page = Math.floor((params.offset || 0) / (params.limit || 50)) + 1;
      delete params.offset;
    }

    const response = await this.api.get("/reviews", {
      params,
    });

    // Handle the deployed backend response format
    if (response.data.reviews) {
      return {
        reviews: response.data.reviews || [],
        total: response.data.total || 0,
        limit: response.data.limit || filters.limit || 50,
        offset: response.data.offset || filters.offset || 0,
        hasMore: response.data.hasMore || false,
      };
    }

    return {
      reviews: [],
      total: 0,
      limit: filters.limit || 50,
      offset: filters.offset || 0,
      hasMore: false,
    };
  }

  async getListingReviews(
    listingId: string,
    rating?: number,
    limit?: number,
    offset?: number
  ): Promise<ListingReviewsResponse> {
    const response = await this.api.get(`/reviews/listing/${listingId}`, {
      params: { rating, limit, offset },
    });

    return {
      reviews: response.data.reviews || [],
      total: response.data.total || 0,
      averageRating: response.data.averageRating || 0,
      ratingDistribution: response.data.ratingDistribution || {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
      limit: response.data.limit || limit || 20,
      offset: response.data.offset || offset || 0,
    };
  }

  async approveReview(
    reviewId: string,
    propertyId: string,
    source: string = "hostaway"
  ) {
    const response = await this.api.post(`/reviews/${reviewId}/approve`, {
      propertyId,
      source,
    });
    return response.data;
  }

  async unapproveReview(reviewId: string) {
    const response = await this.api.delete(`/reviews/${reviewId}/approve`);
    return response.data;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.api.get("/reviews/stats");

    if (response.data.success && response.data.data) {
      const stats = response.data.data;
      return {
        totalReviews: stats.totalReviews || 0,
        approvedReviews: stats.approvedReviews || 0,
        pendingReviews: stats.pendingReviews || 0,
        averageRating: stats.averageRating || 0,
        hostawayReviews: stats.hostawayReviews || 0,
        googleReviews: stats.googleReviews || 0,
        ratingDistribution: stats.ratingDistribution || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
        channelDistribution: stats.channelDistribution || {},
        listingStats: stats.listingStats || {},
        lastUpdated: stats.lastUpdated || new Date().toISOString(),
      };
    }

    return {
      totalReviews: 0,
      approvedReviews: 0,
      pendingReviews: 0,
      averageRating: 0,
      hostawayReviews: 0,
      googleReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      channelDistribution: {},
      listingStats: {},
      lastUpdated: new Date().toISOString(),
    };
  }

  async refreshReviews() {
    const response = await this.api.post("/reviews/refresh");
    return response.data;
  }

  async testGooglePlaces() {
    const response = await this.api.get("/google/test");
    return response.data;
  }

  async searchGooglePlaces(query: string): Promise<GooglePlacesResponse> {
    const response: AxiosResponse<GooglePlacesResponse> = await this.api.get(
      "/google/search",
      {
        params: { query },
      }
    );
    return response.data;
  }

  async getGooglePlaceDetails(
    placeId: string
  ): Promise<GooglePlaceDetailsResponse> {
    const response: AxiosResponse<GooglePlaceDetailsResponse> =
      await this.api.get(`/google/place/${placeId}`);
    return response.data;
  }

  async getFlexLivingGoogleReviews() {
    const response = await this.api.get("/google/flex-living-reviews");
    return response.data;
  }

  async getMockGoogleReviews() {
    const response = await this.api.get("/google/mock-reviews");
    return response.data;
  }

  async getPublicProperties(filters: Record<string, unknown> = {}) {
    const response = await this.api.get("/properties/public", {
      params: filters,
    });

    if (response.data.success && response.data.data) {
      return {
        success: true,
        data: response.data.data,
        count: response.data.data.length,
      };
    }

    return response.data;
  }

  async getAdminProperties(filters: Record<string, unknown> = {}) {
    const response = await this.api.get("/properties", {
      params: filters,
    });

    if (response.data.success && response.data.data) {
      return {
        success: true,
        data: response.data.data,
        count: response.data.data.length,
      };
    }

    return response.data;
  }

  async getProperty(id: string) {
    const response = await this.api.get(`/properties/${id}`);

    if (response.data.success && response.data.data) {
      return {
        success: true,
        data: response.data.data,
      };
    }

    return response.data;
  }

  async syncHostawayListings() {
    const response = await this.api.post("/properties/sync");
    return response.data;
  }

  async approveProperty(id: string) {
    const response = await this.api.post(`/properties/${id}/approve`);
    return response.data;
  }

  async rejectProperty(id: string) {
    const response = await this.api.post(`/properties/${id}/reject`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
