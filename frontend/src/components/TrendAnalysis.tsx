import React from "react";
import type { DashboardStats } from "../types/index";
import { ChartBarIcon } from "@heroicons/react/24/outline";

interface TrendData {
  month: string;
  count: number;
  averageRating: number;
  reviews: any[];
}

interface RecurringIssue {
  keyword: string;
  count: number;
}

interface TrendAnalysisProps {
  trendData: TrendData[] | null;
  recurringIssues: RecurringIssue[];
  stats: DashboardStats | null;
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  trendData,
  recurringIssues,
  stats,
}) => {
  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  const getTrendDirection = (current: number, previous: number) => {
    if (current > previous)
      return { direction: "up", color: "text-[#284E4C]", icon: "📈" };
    if (current < previous)
      return { direction: "down", color: "text-black", icon: "📉" };
    return { direction: "stable", color: "text-gray-600", icon: "➡️" };
  };

  const getRatingTrend = () => {
    if (!trendData || trendData.length < 2) return null;

    const latest = trendData[trendData.length - 1];
    const previous = trendData[trendData.length - 2];

    return getTrendDirection(latest.averageRating, previous.averageRating);
  };

  const getVolumeTrend = () => {
    if (!trendData || trendData.length < 2) return null;

    const latest = trendData[trendData.length - 1];
    const previous = trendData[trendData.length - 2];

    return getTrendDirection(latest.count, previous.count);
  };

  const ratingTrend = getRatingTrend();
  const volumeTrend = getVolumeTrend();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Current Month Reviews
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {trendData && trendData.length > 0
                        ? trendData[trendData.length - 1].count
                        : 0}
                    </div>
                    {volumeTrend && (
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${volumeTrend.color}`}
                      >
                        <span className="mr-1">{volumeTrend.icon}</span>
                        {volumeTrend.direction}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">⭐</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Current Month Rating
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {trendData && trendData.length > 0
                        ? trendData[trendData.length - 1].averageRating.toFixed(
                            1
                          )
                        : "0.0"}
                    </div>
                    {ratingTrend && (
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${ratingTrend.color}`}
                      >
                        <span className="mr-1">{ratingTrend.icon}</span>
                        {ratingTrend.direction}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">⚠️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Recurring Issues
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {recurringIssues.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Monthly Trends</h3>
          <p className="mt-1 text-sm text-gray-500">
            Review volume and rating trends over time
          </p>
        </div>
        <div className="p-6">
          {trendData && trendData.length > 0 ? (
            <div className="space-y-4">
              {trendData.slice(-6).map((month) => (
                <div
                  key={month.month}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-900 w-24">
                      {formatMonth(month.month)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Reviews:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {month.count}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Rating:</span>
                      <span className="text-sm font-medium text-black">
                        {month.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-flex-teal h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (month.count /
                              Math.max(...trendData.map((m) => m.count))) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#284E4C] h-2 rounded-full"
                        style={{ width: `${(month.averageRating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No trend data available
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Trend analysis will appear here once you have sufficient review
                data.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recurring Issues */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recurring Issues
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Common issues mentioned in negative reviews (rating &lt; 4)
          </p>
        </div>
        <div className="p-6">
          {recurringIssues.length > 0 ? (
            <div className="space-y-4">
              {recurringIssues.map((issue, index) => (
                <div
                  key={issue.keyword}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#284E4C] rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {issue.keyword}
                      </div>
                      <div className="text-sm text-gray-500">
                        Mentioned in {issue.count} negative review
                        {issue.count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#284E4C] h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (issue.count /
                              Math.max(
                                ...recurringIssues.map((i) => i.count)
                              )) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-black">
                      {issue.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No recurring issues detected
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Great job! No common issues have been identified in your
                reviews.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Channel Performance */}
      {stats && (
        <div className="glass-card rounded-2xl p-8 animate-slide-up">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-[#284E4C] rounded-xl flex items-center justify-center">
              <ChartBarIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">
                Channel Performance
              </h3>
              <p className="text-gray-600">
                Review distribution and performance by channel
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(stats.channelDistribution || {}).map(
              ([channel, count]) => {
                const percentage =
                  stats.totalReviews > 0
                    ? (count / stats.totalReviews) * 100
                    : 0;

                const getChannelInfo = (channel: string) => {
                  switch (channel.toLowerCase()) {
                    case "hostaway":
                      return {
                        name: "Hostaway",
                        description: "Direct booking platform",
                        color: "from-[#284E4C] to-[#1a3a38]",
                        bgColor: "bg-white",
                        borderColor: "border-gray-200",
                      };
                    case "google":
                      return {
                        name: "Google",
                        description: "Google Reviews",
                        color: "from-[#284E4C] to-[#1a3a38]",
                        bgColor: "bg-white",
                        borderColor: "border-gray-200",
                      };
                    default:
                      return {
                        name:
                          channel.charAt(0).toUpperCase() + channel.slice(1),
                        description: "Review platform",
                        color: "from-[#284E4C] to-[#1a3a38]",
                        bgColor: "bg-white",
                        borderColor: "border-gray-200",
                      };
                  }
                };

                const channelInfo = getChannelInfo(channel);

                return (
                  <div
                    key={channel}
                    className={`p-6 ${channelInfo.bgColor} rounded-xl border ${channelInfo.borderColor} hover:shadow-md transition-shadow duration-200`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-black">
                          {channelInfo.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {channelInfo.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-black">
                          {count.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">reviews</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Market Share</span>
                        <span className="font-semibold text-black">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${channelInfo.color} h-3 rounded-full transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-white rounded-lg">
                        <div className="text-lg font-bold text-black">
                          {stats.averageRating.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">Avg Rating</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <div className="text-lg font-bold text-black">
                          {stats.totalReviews > 0
                            ? Math.round((count / stats.totalReviews) * 100)
                            : 0}
                          %
                        </div>
                        <div className="text-xs text-gray-500">Share</div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}

            {/* Show message if no channel data */}
            {(!stats.channelDistribution ||
              Object.keys(stats.channelDistribution).length === 0) && (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-4">
                  <ChartBarIcon className="h-16 w-16 mx-auto" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  No Channel Data
                </h4>
                <p className="text-slate-600">
                  Channel performance metrics will appear here once reviews are
                  processed
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
