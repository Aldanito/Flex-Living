import React, { useState, useEffect } from "react";
import {
  // StarIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  HeartIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { AnimatedCounter } from "../components/AnimatedCounter";

export const Landing: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#284E4C] via-[#2F4F4F] to-[#1A3A38]">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Premium Corporate
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Housing Solutions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Flexible, furnished apartments for business travelers,
              relocations, and corporate housing needs across London's prime
              locations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
                Explore Properties
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary text-lg px-8 py-4 flex items-center gap-2 group">
                <PlayIcon className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: "150+", label: "Corporate Clients" },
                { number: "500+", label: "Properties" },
                { number: "24/7", label: "Support" },
                { number: "98%", label: "Satisfaction" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    <AnimatedCounter
                      end={parseInt(stat.number.replace(/[^\d]/g, ""))}
                      suffix={
                        stat.number.includes("%")
                          ? "%"
                          : stat.number.includes("+")
                          ? "+"
                          : ""
                      }
                      className="animate-fade-in-up"
                    />
                  </div>
                  <div className="text-gray-300 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-[#284E4C] mb-6">
              Prime Corporate Locations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Strategically located furnished apartments in London's most
              prestigious business districts, designed for corporate travelers
              and relocating professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "CANARY WHARF",
                image:
                  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop&q=80",
                properties: "45+ Properties",
                description: "Financial District",
              },
              {
                name: "CITY OF LONDON",
                image:
                  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop&q=80",
                properties: "32+ Properties",
                description: "Historic Business Hub",
              },
              {
                name: "KING'S CROSS",
                image:
                  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80",
                properties: "28+ Properties",
                description: "Tech & Innovation",
              },
              {
                name: "SOUTH BANK",
                image:
                  "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop&q=80",
                properties: "35+ Properties",
                description: "Cultural Quarter",
              },
            ].map((location, index) => (
              <div
                key={index}
                className="relative group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/600x400/284E4C/ffffff?text=${location.name}`;
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300 rounded-2xl"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-bold text-xl mb-2 group-hover:text-yellow-400 transition-colors">
                    {location.name}
                  </h3>
                  <p className="text-gray-200 text-sm mb-1">
                    {location.description}
                  </p>
                  <p className="text-yellow-400 text-sm font-medium">
                    {location.properties}
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <ArrowRightIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Solutions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-[#284E4C] mb-6">
              Corporate Housing Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tailored solutions for businesses, relocating employees, and
              corporate travelers with premium amenities and professional
              service standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Flexible Terms",
                description:
                  "Short-term to long-term stays with customizable rental agreements that adapt to your business needs.",
                image:
                  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80",
                icon: SparklesIcon,
                features: [
                  "No long-term commitments",
                  "Customizable contracts",
                  "Easy extensions",
                ],
              },
              {
                title: "Move-in Ready",
                description:
                  "Fully furnished corporate apartments with premium amenities and business-grade infrastructure.",
                image:
                  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&q=80",
                icon: BuildingOfficeIcon,
                features: [
                  "High-speed WiFi",
                  "Business center access",
                  "Premium furnishings",
                ],
              },
              {
                title: "Prime Locations",
                description:
                  "Strategically positioned in London's business districts with excellent transport connectivity.",
                image:
                  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80",
                icon: HeartIcon,
                features: [
                  "Business district proximity",
                  "Transport links",
                  "Corporate amenities",
                ],
              },
              {
                title: "Dedicated Support",
                description:
                  "24/7 concierge service and dedicated account management for seamless corporate housing.",
                image:
                  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80",
                icon: ShieldCheckIcon,
                features: [
                  "24/7 concierge",
                  "Account management",
                  "Emergency support",
                ],
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/600x400/284E4C/ffffff?text=${feature.title}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#284E4C] mb-3 group-hover:text-[#1A3A38] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {feature.features.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#284E4C] via-[#2F4F4F] to-[#1A3A38] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Corporate Housing?
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join 150+ companies already using The Flex for their corporate
              housing needs. Get a personalized quote and discover how we can
              streamline your accommodation strategy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="bg-white text-[#284E4C] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-lg group">
                Get Corporate Quote
                <ArrowRightIcon className="w-5 h-5 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#284E4C] transition-all duration-300">
                Schedule Demo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-300 text-sm">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">48hrs</div>
                <div className="text-gray-300 text-sm">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">100%</div>
                <div className="text-gray-300 text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
