import React, { useState } from "react";
import { africanRestaurants } from "../../Data/RestaurantData";
import { FaSearch, FaStar, FaLeaf, FaTimes, FaPhone, FaClock, FaGlobe, FaArrowLeft } from "react-icons/fa";
import "./RestaurantPage.css";

const RestaurantPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const filteredRestaurants = africanRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const closeModal = () => {
    setSelectedRestaurant(null);
  };

  return (
    <div className="restaurant-page">
      <div className="menu-header">
        <h1 className="title">Discover RoadRunner African Cuisines</h1>
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search restaurants or cuisines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="menu-page">
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-card" onClick={() => openModal(restaurant)}>
              <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
              <div className="restaurant-info">
                <h2 className="restaurant-name">{restaurant.name}</h2>
                <p className="cuisine">{restaurant.cuisine}</p>
                <div className="rating">
                  <FaStar />
                  <span>{restaurant.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRestaurant && (
        <div className="modal">
          <div className="modal-content">
            <button className="back-button" onClick={closeModal}>
              <FaArrowLeft />
              Back
            </button>
            <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="modal-image" />
            <h2>{selectedRestaurant.name}</h2>
            <p className="cuisine">{selectedRestaurant.cuisine}</p>
            <div className="rating">
              <FaStar />
              <span>{selectedRestaurant.rating}</span>
            </div>
            {selectedRestaurant.isEco && (
              <div className="eco-friendly">
                <FaLeaf />
                Eco-Friendly
              </div>
            )}
            <p className="description">{selectedRestaurant.description}</p>
            <h3>Specialties</h3>
            <ul className="specialties">
              {selectedRestaurant.specialties.map((specialty, index) => (
                <li key={index}>{specialty}</li>
              ))}
            </ul>
            <div className="contact-info">
              <p><FaPhone /> {selectedRestaurant.phone}</p>
              <p><FaClock /> {selectedRestaurant.hours}</p>
              <p><FaGlobe /> {selectedRestaurant.website}</p>
            </div>
            <p><strong>Address:</strong> {selectedRestaurant.address}</p>
            <p><strong>Price Range:</strong> {selectedRestaurant.priceRange}</p>
            <p><strong>Delivery Options:</strong> {selectedRestaurant.deliveryOptions.join(", ")}</p>
            <p><strong>Ambiance:</strong> {selectedRestaurant.ambiance}</p>
            <p><strong>Founded:</strong> {selectedRestaurant.foundedYear}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantPage;