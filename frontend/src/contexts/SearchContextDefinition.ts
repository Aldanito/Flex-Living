import { createContext } from "react";

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

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);
