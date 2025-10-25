import React from "react";
import type { DashboardStats } from "../types/index";
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: "Total Reviews",
      value: stats.totalReviews.toLocaleString(),
      icon: ChartBarIcon,
      gradient: "from-[#284E4C] to-[#1a3a38]",
      bgGradient: "from-[#284E4C]/10 to-[#1a3a38]/10",
      change: "+12%",
      changeType: "positive" as const,
      description: "All time reviews",
    },
    {
      title: "Approved Reviews",
      value: stats.approvedReviews.toLocaleString(),
      icon: CheckCircleIcon,
      gradient: "from-[#284E4C] to-[#1a3a38]",
      bgGradient: "from-white to-white",
      change: "+8%",
      changeType: "positive" as const,
      description: "Publicly visible",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews.toLocaleString(),
      icon: ClockIcon,
      gradient: "from-[#284E4C] to-[#1a3a38]",
      bgGradient: "from-white to-white",
      change: "-5%",
      changeType: "negative" as const,
      description: "Awaiting approval",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      icon: StarIcon,
      gradient: "from-[#284E4C] to-[#1a3a38]",
      bgGradient: "from-white to-white",
      change: "+0.2",
      changeType: "positive" as const,
      description: "Out of 5.0 stars",
    },
  ];

  return (
    <div className="space-y-8">
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group glass-card rounded-2xl p-6 card-hover animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-black uppercase tracking-wide">
                        {card.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-black group-hover:scale-105 transition-transform duration-300">
                      {card.value}
                    </span>
                    <div
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        card.changeType === "positive"
                          ? "bg-[#284E4C] text-white"
                          : "bg-black text-white"
                      }`}
                    >
                      {card.changeType === "positive" ? (
                        <ArrowTrendingUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-3 w-3" />
                      )}
                      <span>{card.change}</span>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="mt-4">
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000 group-hover:scale-x-105`}
                    style={{
                      width:
                        card.title === "Average Rating"
                          ? `${(parseFloat(card.value) / 5) * 100}%`
                          : card.title === "Total Reviews"
                          ? "100%"
                          : card.title === "Approved Reviews"
                          ? `${
                              (stats.approvedReviews / stats.totalReviews) * 100
                            }%`
                          : `${
                              (stats.pendingReviews / stats.totalReviews) * 100
                            }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {}
      <div className="glass-card rounded-2xl p-8 animate-slide-up">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[#284E4C] rounded-xl flex items-center justify-center">
            <StarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black">
              Rating Distribution
            </h3>
            <p className="text-gray-600">Breakdown of guest ratings</p>
          </div>
        </div>

        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              stats.ratingDistribution[
                rating as keyof typeof stats.ratingDistribution
              ];
            const percentage =
              stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

            const getRatingColor = (rating: number) => {
              switch (rating) {
                case 5:
                  return "from-[#284E4C] to-[#1a3a38]";
                case 4:
                  return "from-[#284E4C] to-[#1a3a38]";
                case 3:
                  return "from-[#284E4C] to-[#1a3a38]";
                case 2:
                  return "from-[#284E4C] to-[#1a3a38]";
                case 1:
                  return "from-[#284E4C] to-[#1a3a38]";
                default:
                  return "from-[#284E4C] to-[#1a3a38]";
              }
            };

            return (
              <div
                key={rating}
                className="flex items-center space-x-4 p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                {}
                <div className="flex items-center space-x-2 min-w-[80px]">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating
                            ? "text-[#284E4C] fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-black">
                    {rating} Star{rating !== 1 ? "s" : ""}
                  </span>
                </div>

                {}
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${getRatingColor(
                        rating
                      )} h-3 rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {}
                <div className="flex items-center space-x-4 min-w-[120px]">
                  <div className="text-right">
                    <div className="text-lg font-bold text-black">
                      {count.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">reviews</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-black">
                      {percentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">of total</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {}
      <div className="glass-card rounded-2xl p-8 animate-slide-up">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[#284E4C] rounded-xl flex items-center justify-center">
            <ChartBarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black">Reviews by Channel</h3>
            <p className="text-gray-600">Distribution across platforms</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(stats.channelDistribution || {}).map(
            ([channel, count]) => {
              const percentage =
                stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

              const getChannelInfo = (channel: string) => {
                switch (channel.toLowerCase()) {
                  case "hostaway":
                    return {
                      name: "Hostaway",
                      description: "Direct booking platform",
                      color: "from-[#284E4C] to-[#1a3a38]",
                      icon: (
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      ),
                    };
                  case "google":
                    return {
                      name: "Google",
                      description: "Google Reviews",
                      color: "from-[#284E4C] to-[#1a3a38]",
                      icon: (
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                      ),
                    };
                  default:
                    return {
                      name: channel.charAt(0).toUpperCase() + channel.slice(1),
                      description: "Review platform",
                      color: "from-[#284E4C] to-[#1a3a38]",
                      icon: (
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                      ),
                    };
                }
              };

              const channelInfo = getChannelInfo(channel);

              return (
                <div
                  key={channel}
                  className="flex items-center space-x-4 p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  {}
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${channelInfo.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <div className="text-white">{channelInfo.icon}</div>
                  </div>

                  {}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">
                          {channelInfo.name}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {channelInfo.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {count.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600">
                          {percentage.toFixed(1)}% of total
                        </div>
                      </div>
                    </div>

                    {}
                    <div className="mt-3">
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${channelInfo.color} h-2 rounded-full transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}

          {}
          {(!stats.channelDistribution ||
            Object.keys(stats.channelDistribution).length === 0) && (
            <div className="text-center py-8">
              <div className="text-slate-400 mb-2">
                <ChartBarIcon className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-slate-600">No channel data available</p>
              <p className="text-sm text-slate-500">
                Channel distribution will appear here once reviews are processed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
