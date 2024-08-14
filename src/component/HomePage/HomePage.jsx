import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./HomePage.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import GetStarted from "../GetStart/GetStarted";

const HomePage = () => {
  const sliderImages = [
    '/images/food.jpeg',
    '/images/food1.jpeg',
    '/images/food2.jpeg',
    '/images/food3.jpg',
    '/images/food4.jpg',
    '/images/food5.jpeg',
    '/images/food6.jpg',
    '/images/food7.jpg'
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState(null);
  const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchResultsModalOpen, setIsSearchResultsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + sliderImages.length) % sliderImages.length);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const results = FoodOrderingPage.africanFoods.filter(food => 
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (food.ingredients && food.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
    setSearchResults(results);
    setIsSearchResultsModalOpen(true);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLocationModalOpen(true);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const closeModal = (setModalState) => () => setModalState(false);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="slider">
          <div className="slider-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {sliderImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className="slider-image"
              />
            ))}
          </div>
          <button className="slider-arrow left" onClick={prevSlide}>&lt;</button>
          <button className="slider-arrow right" onClick={nextSlide}>&gt;</button>
        </div>
        <div className="slider-overlay">
          <div className="search-section">
            <button onClick={() => setIsGetStartedModalOpen(true)} className="get-started-button">
              Get Started
            </button>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for dishes or ingredients..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button type="submit" className="search-button">Search</button>
            </form>
            <button onClick={getCurrentLocation} className="location-button">
              Use Current Location
            </button>
          </div>
          {location && (
            <div className="location-info">
              Latitude: {location.latitude.toFixed(4)}, Longitude: {location.longitude.toFixed(4)}
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {isGetStartedModalOpen && (
        <Modal onClose={closeModal(setIsGetStartedModalOpen)}>
          <GetStarted onClose={closeModal(setIsGetStartedModalOpen)} />
        </Modal>
      )}

      {isSearchResultsModalOpen && (
        <Modal onClose={closeModal(setIsSearchResultsModalOpen)}>
          {searchResults.length > 0 ? (
            <FoodOrderingPage foods={searchResults} cart={cart} setCart={setCart} />
          ) : (
            <p>Food item not found. Please try another search.</p>
          )}
        </Modal>
      )}

      {isLocationModalOpen && location && (
        <Modal onClose={closeModal(setIsLocationModalOpen)}>
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>You are here.</Popup>
            </Marker>
          </MapContainer>
        </Modal>
      )}

      {/* Featured Dishes Section */}
      <section className="featured-dishes">
        <h2>Featured Dishes</h2>
        <div className="dishes-container">
          <div className="dish">
          <img src="/images/food8.jpeg" alt="Signature Dish 1" className="dish-image" />
            <div className="dish-content">
              <h3>Jollof Rice with Grilled Chicken</h3>
              <p>Our signature Jollof Rice is a beloved West African classic, perfected by Roadrunner Food Ordering. We start with the finest long-grain rice, simmered in a rich tomato and pepper sauce, infused with aromatic spices. The dish is complemented by tender, perfectly grilled chicken, marinated in a blend of African herbs and spices. This combination offers a harmonious balance of flavors, representing the vibrant and diverse culinary traditions of West Africa.</p>
            </div>
          </div>
          <div className="dish">
            <img src="/images/food9.webp" alt="Signature Dish 2" className="dish-image" />
            <div className="dish-content">
              <h3>Pap and Chakalaka</h3>
              <p>Experience the heart of South African cuisine with our Pap and Chakalaka. The pap, a staple made from ground maize, is cooked to creamy perfection, providing a comforting base for the dish. It's paired with our zesty chakalaka, a spicy vegetable relish bursting with flavors of tomatoes, onions, peppers, and a secret blend of spices. This vegetarian-friendly option showcases the diversity of African cuisine and is a customer favorite across our locations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us">
        <h2>Our Story</h2>
        <div className="about-content">
        <img src="/images/food13.jpg" alt="Our Restaurant" className="about-image" />
          <div className="about-text">
            <p>Founded in 2015 by a group of passionate food enthusiasts, Roadrunner Food Ordering has been on a mission to revolutionize the African food delivery landscape. Our journey began with a simple idea: to make the rich, diverse flavors of African cuisine accessible to people across the continent, right at their doorstep.</p>
            <p>Starting from a small office in Lagos, Nigeria, we quickly expanded our operations, driven by the overwhelming response from food lovers. Our commitment to quality, authenticity, and customer satisfaction has been the cornerstone of our growth. Today, Roadrunner Food Ordering proudly serves customers in numerous countries across the African continent, from the bustling streets of Cairo to the vibrant communities of Cape Town.</p>
            <p>At Roadrunner, we believe that food is more than just sustenance - it's a celebration of culture, tradition, and community. Our platform brings together a curated selection of restaurants, from local gems serving traditional dishes to modern eateries offering innovative African fusion cuisine. We're not just delivering food; we're delivering a taste of Africa's culinary heritage to your doorstep.</p>
          </div>
        </div>
      </section>

      {/* Menu Highlights Section */}
      <section className="menu-highlights">
        <h2>Menu Highlights</h2>
        <div className="highlights-container">
          <div className="highlight">
            <div className="highlight-content">
              <h3>Appetizers</h3>
              <p>Begin your culinary journey across Africa with our diverse range of appetizers. Savor the crispy goodness of Kenyan Samosas, filled with spiced meat or vegetables. Try the Nigerian Suya, thinly sliced beef seasoned with ground peanuts and spices. For a lighter option, our Moroccan Zaalouk, a smoky eggplant dip, paired with warm pita bread, offers a burst of Mediterranean flavors. These starters are designed to awaken your palate to the rich tapestry of African cuisine.</p>
            </div>
            <img src="/images/food10.jpg" alt="Appetizer" className="highlight-image" />
          </div>
          <div className="highlight">
            <div className="highlight-content">
              <h3>Main Courses</h3>
              <p>Our main courses showcase the diversity of African cuisine. Indulge in the aromatic Ethiopian Doro Wat, a spicy chicken stew served with injera bread. For seafood enthusiasts, our Senegalese Thieboudienne, a flavorful one-pot dish of fish, rice, and vegetables, is a must-try. Vegetarians will love our Ghanaian Red Red, a hearty black-eyed pea stew served with fried plantains. Each dish is prepared with authentic recipes and the freshest ingredients, bringing the true taste of Africa to your table.</p>
            </div>
            <img src="/images/food11.webp" alt="Main Course" className="highlight-image" />
          </div>
          <div className="highlight">
            <div className="highlight-content">
              <h3>Desserts</h3>
              <p>Complete your meal with our selection of traditional African desserts. Try the South African Malva Pudding, a sweet and sticky sponge cake served with custard. For a tropical treat, our Tanzanian Kashata, a coconut and peanut brittle, offers a perfect balance of sweet and nutty flavors. Don't miss the Egyptian Umm Ali, a bread pudding infused with nuts and raisins, served warm and topped with a dollop of cream. These desserts are the perfect way to end your Roadrunner Food Ordering experience on a sweet note.</p>
            </div>
            <img src="/images/food12.jpg" alt="Dessert" className="highlight-image" />
          </div>
        </div>
      </section>
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-button" onClick={onClose}>×</button>
      {children}
    </div>
  </div>
);

export default HomePage;