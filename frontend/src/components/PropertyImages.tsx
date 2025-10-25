import React from "react";

interface PropertyImagesProps {
  listingId: string;
}

export const PropertyImages: React.FC<PropertyImagesProps> = () => {
  const images = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Living room with modern furniture",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80",
      alt: "Bedroom with comfortable bed",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Modern bathroom",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Kitchen and dining area",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Balcony view",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80",
      alt: "Exterior view",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-2 gap-2 h-96">
        {}
        <div className="col-span-2 row-span-2">
          <img
            src={images[0].url}
            alt={images[0].alt}
            className="w-full h-full object-cover"
          />
        </div>

        {}
        {images.slice(1, 5).map((image) => (
          <div key={image.id} className="relative">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {image.id === 5 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <button className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium hover:bg-gray-100">
                  View all photos
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
