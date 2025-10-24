import React, { useState } from "react";
import {
  CalendarDaysIcon,
  UserIcon,
  CheckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface BookingWidgetProps {
  listingId: string;
}

export const BookingWidget: React.FC<BookingWidgetProps> = () => {
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  return (
    <div className="sticky top-6">
      <div className="bg-gradient-to-br from-[#284E4C] to-[#1a3a38] rounded-2xl shadow-2xl text-white overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-br from-[#284E4C] to-[#1a3a38] py-6 px-6 z-10 border-b border-white/10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Book Your Stay
            </h2>
            <p className="text-sm text-white">Select dates to see prices</p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Check-in & Check-out
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm [color-scheme:dark]"
                    placeholder="Check-in"
                  />
                  <CalendarDaysIcon className="absolute right-3 top-3.5 w-5 h-5 text-white" />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm [color-scheme:dark]"
                    placeholder="Check-out"
                  />
                  <CalendarDaysIcon className="absolute right-3 top-3.5 w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Guests
              </label>
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="w-5 h-5 text-white" />
                    <span className="font-medium text-white">
                      {guests} Guest{guests !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setGuests(guests + 1)}
                      className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-white text-[#284E4C] py-4 px-6 rounded-xl font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
                Check availability
              </button>
              <button className="w-full border-2 border-white/30 text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 backdrop-blur-sm">
                Send inquiry
              </button>
            </div>

            <div className="flex items-center space-x-3 pt-4 border-t border-white/20">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="instantBooking"
                  className="h-5 w-5 text-[#284E4C] focus:ring-[#284E4C] border-white/30 rounded bg-white/10"
                />
              </div>
              <label
                htmlFor="instantBooking"
                className="text-sm text-white flex items-center space-x-2"
              >
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Instant booking confirmation</span>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-sm text-white">Starting from</span>
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">£200</div>
              <p className="text-sm text-white">per night</p>
              <div className="mt-3 text-xs text-white">
                <p>✓ Free cancellation</p>
                <p>✓ No booking fees</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
