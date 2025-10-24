# Flex Living - Comprehensive Technical Documentation

## Project Overview

**Flex Living** is a full-stack review management system designed for property managers to aggregate, analyze, and manage guest reviews from multiple platforms (Hostaway and Google Places). The application provides an intuitive dashboard for review moderation, analytics, and property management, alongside public-facing property pages with approved reviews.

**Purpose**: Centralized review management and analytics platform for short-term rental properties  
**Type**: Full-stack web application with REST API  
**Target Users**: Property managers, administrators, and public guests

---

## Demo Access

### Manager Login Credentials

For testing and demonstration purposes, use the following credentials to access the manager dashboard:

**Email**: `manager@flexliving.com`  
**Password**: `password123`

**Access Points**:

- Manager Dashboard: `/dashboard`
- Property Management: `/dashboard/properties`
- Review Management: `/dashboard/reviews`

**Note**: This is a demo account with full manager privileges for testing the application features.

---

## Architecture

### System Design

The application follows a three-tier architecture:

1. **Frontend (React SPA)**: User interface with responsive design
2. **Backend (Node.js/Express API)**: RESTful API server with business logic
3. **Database (MongoDB)**: Document-based data persistence

```
┌─────────────────┐
│  React Frontend │ ──────> Public property pages
│   (Port 3000)   │ ──────> Manager dashboard
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Express API    │ ──────> JWT Authentication
│   (Port 5001)   │ ──────> Review processing
└────────┬────────┘
         │
         ├──────> MongoDB (Reviews, Users, Properties)
         ├──────> Hostaway API (External reviews)
         └──────> Google Places API (External reviews)
```

### Key Technologies

**Backend**:

- Node.js v18+ with TypeScript
- Express.js for REST API
- Mongoose for MongoDB ODM
- JWT for authentication
- Axios for external API calls
- bcryptjs for password hashing
- Helmet & CORS for security

**Frontend**:

- React 19 with TypeScript
- Vite for build tooling
- React Router v7 for navigation
- Tailwind CSS for styling
- Heroicons for UI icons
- Axios for API communication

**Infrastructure**:

- Docker & Docker Compose for containerization
- MongoDB Atlas for cloud database
- Nginx for frontend serving

---

## Core Features

### 1. Review Aggregation System

**Hybrid Reviews Service** (`backend/src/services/hybridReviews.ts`):

- Combines reviews from Hostaway and Google Places APIs
- Normalizes data formats from different sources
- Implements 5-minute caching to reduce API calls
- Maps reviews to approved properties in the database

**Data Flow**:

1. Fetch approved properties from MongoDB
2. Query Hostaway API for booking platform reviews
3. Query Google Places API for each property
4. Normalize and merge all reviews
5. Cache results for performance

### 2. Manager Dashboard

**Features** (`frontend/src/pages/Dashboard.tsx`):

- **Statistics Overview**: Total reviews, approval rates, average ratings, channel distribution
- **Review Management**: Filter, search, approve/reject reviews with bulk operations
- **Property Performance**: Per-property analytics with rating trends
- **Trend Analysis**: Time-series analysis and recurring issue detection

**Key Components**:

- `StatsCards`: Real-time metrics display with animated counters
- `ReviewsTable`: Paginated table with filtering and bulk actions
- `PropertyPerformanceTable`: Property-level analytics
- `TrendAnalysis`: Visual trend charts and issue detection

### 3. Property Management

**Admin Features** (`frontend/src/components/PropertyManagement.tsx`):

- Sync properties from Hostaway API
- Approve/reject properties for public display
- Manage property details and metadata
- Link properties with Google Place IDs

**Property Model** (`backend/src/models/Property.ts`):

```typescript
{
  name: string,
  hostawayId: string,
  googlePlaceId: string,
  address: string,
  city: string,
  bedrooms: number,
  bathrooms: number,
  amenities: string[],
  images: string[],
  status: "pending" | "approved" | "rejected"
}
```

### 4. Public Property Pages

**Features** (`frontend/src/pages/PropertyDetails.tsx`):

- Interactive property gallery with image carousel
- Google Maps integration with property location
- Approved reviews display with ratings
- Booking widget with date selection
- Amenities and features showcase

### 5. Authentication & Authorization

**JWT-based Authentication** (`backend/src/routes/auth.ts`):

- User registration and login
- Access token (15min) + Refresh token (7 days)
- Role-based access control (manager/admin)
- Protected routes with middleware

**Auth Flow**:

1. User logs in → Server validates credentials
2. Server issues JWT access + refresh tokens
3. Frontend stores tokens in localStorage
4. Frontend sends access token with each request
5. Middleware validates token and user role
6. On 401, frontend auto-refreshes token

---

## Data Models

### Review Model (`backend/src/models/Review.ts`)

```typescript
{
  source: "hostaway" | "google",
  sourceId: string,
  listingId: string,
  listingName: string,
  rating: number (1-10),
  reviewText: string,
  reviewerName: string,
  categories: [{ category: string, rating: number }],
  channel: string,
  submittedAt: Date,
  status: "pending" | "approved" | "rejected",
  isPublic: boolean
}
```

### User Model (`backend/src/models/User.ts`)

```typescript
{
  email: string,
  password: string (hashed),
  role: "manager" | "admin"
}
```

---

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Reviews

- `GET /api/reviews` - Get all reviews (filtered, paginated)
- `GET /api/reviews/stats` - Dashboard statistics
- `GET /api/reviews/listing/:id` - Reviews for specific property
- `POST /api/reviews/:id/approve` - Approve review
- `DELETE /api/reviews/:id/approve` - Unapprove review
- `POST /api/reviews/sync-hostaway` - Sync Hostaway reviews
- `GET /api/reviews/public` - Get public approved reviews

### Properties

- `GET /api/properties` - Get all properties (admin)
- `GET /api/properties/public` - Get approved properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties/sync` - Sync from Hostaway
- `POST /api/properties/:id/approve` - Approve property
- `POST /api/properties/:id/reject` - Reject property

### Google Integration

- `GET /api/google/search?query=...` - Search Google Places
- `GET /api/google/place/:placeId` - Get place details + reviews

---

## External API Integrations

### Hostaway API

- **Authentication**: API Key in headers
- **Endpoints Used**:
  - Listings retrieval
  - Reviews retrieval with pagination
- **Data Normalization**: Converts Hostaway format to internal schema

### Google Places API

- **Authentication**: API Key in request parameters
- **Endpoints Used**:
  - Place Search (Text Search)
  - Place Details (with reviews)
- **Rate Limiting**: Cached results, throttled requests

---

## Deployment

### Docker Configuration (`docker-compose.yml`)

- **Backend**: Port 5001, connected to MongoDB Atlas
- **Frontend**: Port 3000, Nginx-served static files
- Health checks configured for both services
- Environment variables injected via Docker

### Environment Variables

**Backend** (`.env`):

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
HOSTAWAY_API_KEY=...
GOOGLE_PLACES_API_KEY=...
```

**Frontend** (`.env`):

```
VITE_API_URL=http://localhost:5001/api
```

---

## Key Implementation Patterns

### Frontend State Management

- React Context API for authentication (`AuthContext`)
- Local component state with hooks (useState, useEffect)
- Custom hooks for search functionality (`SearchContext`)

### API Service Layer

- Centralized Axios instance with interceptors (`frontend/src/services/api.ts`)
- Automatic token refresh on 401 responses
- Type-safe API calls with TypeScript interfaces

### Error Handling

- Global error handler in Express backend
- Try-catch blocks with user-friendly messages
- Fallback UI states for API failures

### Data Caching

- 5-minute cache in `HybridReviewsService`
- Timestamp-based cache invalidation
- Reduces external API costs

---

## Security Features

1. **Helmet.js**: Sets security-related HTTP headers
2. **CORS**: Configured origin whitelist
3. **JWT**: Secure token-based authentication
4. **Password Hashing**: bcrypt with salt rounds
5. **Input Validation**: Express-validator middleware
6. **Rate Limiting**: Configurable request throttling

---

## Performance Optimizations

1. **MongoDB Indexing**: Indexes on frequently queried fields
2. **Data Caching**: In-memory cache for external API responses
3. **Pagination**: Offset-based pagination for large datasets
4. **Lazy Loading**: Component-level code splitting
5. **Image Optimization**: WebP format for property images

---

## Future Enhancements

- WebSocket integration for real-time review updates
- AI-powered sentiment analysis on review text
- Multi-language support (i18n)
- Advanced analytics with data visualization
- Email notifications for new reviews
- Mobile app (React Native)

---

**Documentation Version**: 1.0  
**Last Updated**: October 2025  
**Tech Stack**: MERN (MongoDB, Express, React, Node.js) + TypeScript
