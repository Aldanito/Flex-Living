import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  HomeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import apiService from "../services/api";

interface Property {
  _id: string;
  name: string;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight?: number;
  pricePerMonth?: number;
  images: string[];
  status: "pending" | "approved" | "rejected";
  approved: boolean;
  hostawayListingId?: string;
  createdAt: string;
}

export const PropertyManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  useEffect(() => {
    loadProperties();
  }, [filter]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminProperties({
        status: filter === "all" ? undefined : filter,
      });
      setProperties(response.data || []);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await apiService.syncHostawayListings();
      await loadProperties();
    } catch (error) {
      console.error("Error syncing properties:", error);
    } finally {
      setSyncing(false);
    }
  };

  const handleApprove = async (propertyId: string) => {
    try {
      await apiService.approveProperty(propertyId);
      setProperties((prev) =>
        prev.map((p) =>
          p._id === propertyId
            ? { ...p, status: "approved" as const, approved: true }
            : p
        )
      );
    } catch (error) {
      console.error("Error approving property:", error);
    }
  };

  const handleReject = async (propertyId: string) => {
    try {
      await apiService.rejectProperty(propertyId);
      setProperties((prev) =>
        prev.map((p) =>
          p._id === propertyId
            ? { ...p, status: "rejected" as const, approved: false }
            : p
        )
      );
    } catch (error) {
      console.error("Error rejecting property:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-600 text-white",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatPrice = (property: Property) => {
    if (property.pricePerNight) {
      return `£${property.pricePerNight}/night`;
    }
    if (property.pricePerMonth) {
      return `£${property.pricePerMonth}/month`;
    }
    return "Price on request";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Property Management
          </h2>
          <p className="text-gray-600">
            Manage and approve properties from Hostaway
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center space-x-2 bg-[#284E4C] text-white px-4 py-2 rounded-lg hover:bg-[#1a3a38] transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon
            className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`}
          />
          <span>{syncing ? "Syncing..." : "Sync from Hostaway"}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? "bg-[#284E4C] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== "all" && (
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {properties.filter((p) => p.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#284E4C] mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center">
            <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600">
              {filter === "all"
                ? "No properties have been synced from Hostaway yet."
                : `No ${filter} properties found.`}
            </p>
            {filter === "all" && (
              <button
                onClick={handleSync}
                className="mt-4 bg-[#284E4C] text-white px-4 py-2 rounded-lg hover:bg-[#1a3a38] transition-colors"
              >
                Sync Properties
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={
                              property.images[0] ||
                              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop"
                            }
                            alt={property.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">
                            {property.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {property.hostawayListingId || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {property.address}
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {property.bedrooms === 0
                          ? "Studio"
                          : `${property.bedrooms} bed${
                              property.bedrooms > 1 ? "s" : ""
                            }`}
                      </div>
                      <div>
                        {property.bathrooms} bath
                        {property.bathrooms > 1 ? "s" : ""}
                      </div>
                      <div>
                        {property.maxGuests} guest
                        {property.maxGuests > 1 ? "s" : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(property)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(property.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {property.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(property._id)}
                              className="text-[#284E4C] hover:text-[#1a3a38] flex items-center space-x-1"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReject(property._id)}
                              className="text-black hover:text-gray-700 flex items-center space-x-1"
                            >
                              <XMarkIcon className="h-4 w-4" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        {property.status === "approved" && (
                          <button
                            onClick={() => handleReject(property._id)}
                            className="text-black hover:text-gray-700 flex items-center space-x-1"
                          >
                            <XMarkIcon className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        )}
                        {property.status === "rejected" && (
                          <button
                            onClick={() => handleApprove(property._id)}
                            className="text-[#284E4C] hover:text-[#1a3a38] flex items-center space-x-1"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
