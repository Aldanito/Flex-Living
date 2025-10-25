import React, { useState, ReactNode } from "react";
import { SearchContext } from "./SearchContextDefinition";

interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  bedrooms?: number;
  maxPrice?: number;
}

const defaultFilters: SearchFilters = {
  location: "LONDON",
  checkIn: "",
  checkOut: "",
  guests: 1,
  bedrooms: undefined,
  maxPrice: undefined,
};

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const updateFilter = (
    key: keyof SearchFilters,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <SearchContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        clearFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
