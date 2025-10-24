import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  bedrooms?: number;
  maxPrice?: number;
}

interface SearchContextType {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (
    key: keyof SearchFilters,
    value: string | number | undefined
  ) => void;
  clearFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

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

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
