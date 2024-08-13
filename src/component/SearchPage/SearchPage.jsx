import React, { useState } from "react";
import "./SearchPage.css";

const products = [
  { id: 1, name: 'Product 1', description: 'Description of Product 1' },
  { id: 2, name: 'Product 2', description: 'Description of Product 2' },
  { id: 3, name: 'Product 3', description: 'Description of Product 3' },
  // Add more products as needed
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Fetch user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        error => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );

    // If user's location is available, sort products by proximity
    if (userLocation) {
      filtered.sort((a, b) => {
        // For demonstration, assume a random distance metric calculation
        // Ideally, use a real distance calculation based on lat/lng
        const distanceA = Math.random() * 100; // Replace with actual calculation
        const distanceB = Math.random() * 100; // Replace with actual calculation

        return distanceA - distanceB; // Sort by closest first
      });
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="search-page">
      <h1>Search Products</h1>
      <input
        type="text"
        placeholder="Search for a product..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <div className="product-list">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-item">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
