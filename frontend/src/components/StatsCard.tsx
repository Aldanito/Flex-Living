import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: "primary" | "success" | "warning" | "error" | "secondary";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  trend,
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "success":
        return "bg-success-50 border-success-200 text-success-700";
      case "warning":
        return "bg-warning-50 border-warning-200 text-warning-700";
      case "error":
        return "bg-error-50 border-error-200 text-error-700";
      case "secondary":
        return "bg-secondary-50 border-secondary-200 text-secondary-700";
      default:
        return "bg-primary-50 border-primary-200 text-primary-700";
    }
  };

  const getIconColorClasses = (color: string) => {
    switch (color) {
      case "success":
        return "text-success-600";
      case "warning":
        return "text-warning-600";
      case "error":
        return "text-error-600";
      case "secondary":
        return "text-secondary-600";
      default:
        return "text-primary-600";
    }
  };

  return (
    <div className={`card p-6 border-l-4 ${getColorClasses(color)}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-success-600" : "text-error-600"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-sm opacity-75 ml-1">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`p-3 rounded-full bg-white ${getIconColorClasses(
              color
            )}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
