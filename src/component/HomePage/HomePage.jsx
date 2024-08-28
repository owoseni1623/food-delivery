import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
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
                placeholder="Search for restaurants, dishes, or ingredients..."
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
              <h3>Ewa Agonyin with Bread and Pepsi Cola</h3>
              <p>Our delectable Ewa Agonyin is a true culinary delight. We begin with premium black-eyed peas, slow-cooked to creamy perfection and generously smothered in a rich, spicy palm oil sauce. This hearty dish is complemented by our freshly baked bread, offering a perfect balance of textures. To round out this satisfying meal, we serve it with an ice-cold Pepsi cola, providing a refreshing contrast to the savory flavors. This classic combination represents the best of Nigerian street food, bringing together traditional tastes with modern convenience for a truly memorable dining experience.</p>
            </div>
          </div>
          <div className="dish">
            <img src="/images/Grilled Spiced Lamb Chops.jpeg" alt="Signature Dish 2" className="dish-image" />
            <div className="dish-content">
              <h3>Grilled Spiced Lamb Chops</h3>
              <p>Our Pap and Chakalaka is a luxurious dish that showcases the hearty, comforting flavors of South African cuisine. We begin with creamy pap, a staple made from ground maize, cooked to smooth perfection. This serves as the perfect canvas for our vibrant chakalaka - a spicy vegetable relish bursting with flavors. A medley of tomatoes, onions, peppers, and carrots is sautéed and seasoned with our secret blend of spices, creating a dish that's both nutritious and intensely flavorful. This vegetarian-friendly option is a customer favorite across our locations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us">
        <h2>Our Story</h2>
        <div className="about-content">
          <img src="/images/food13.jpg" alt="Our Restaurant" className="about-image" />
          <div className="about-text-container">
            <div className="about-text">
              <p>Founded in 2015, Roadrunner Food Ordering emerged from a vision to revolutionize the African food delivery landscape. Our journey began in Lagos, Nigeria, with a small team united by a passion for showcasing the rich tapestry of African cuisine to a wider audience.</p>
              
              <p>In our early days, we faced numerous challenges. The food delivery market in Africa was largely untapped, with fragmented local services and limited technology adoption. However, we saw this as an opportunity rather than an obstacle. We invested heavily in developing a user-friendly platform that could work seamlessly across various devices and internet speeds, ensuring accessibility for all our customers.</p>
              
              <p>Our first year was a whirlwind of activity. We partnered with local restaurants, from small family-owned establishments to popular chains, to bring a diverse array of African cuisines to our platform. Our commitment to quality and authenticity quickly gained us a loyal customer base in Lagos.</p>
              
              <p>By 2017, we had expanded to five major Nigerian cities. Our success caught the attention of investors, allowing us to secure funding for further expansion. This financial boost enabled us to enhance our technology, improving our app's functionality and expanding our delivery network.</p>
              
              <p>2018 marked our first international expansion as we ventured into Ghana and Kenya. We faced new challenges in adapting to different market dynamics and culinary preferences, but our adaptive approach and commitment to local tastes ensured our success.</p>
              
              <p>The COVID-19 pandemic in 2020 presented unprecedented challenges, but also opportunities. As lockdowns were implemented across the continent, our service became more essential than ever. We quickly implemented contactless delivery options and strict safety protocols, ensuring we could continue serving our customers while prioritizing health and safety.</p>
              
              <p>Today, Roadrunner Food Ordering proudly operates in over 20 countries across Africa. From the bustling streets of Cairo to the vibrant communities of Cape Town, we've become a household name in food delivery. Our platform now features thousands of restaurants, offering everything from traditional dishes to modern African fusion cuisine.</p>
              
              <p>But our journey is far from over. We continue to innovate, exploring new technologies like drone delivery for remote areas and AI-powered recommendation systems to enhance user experience. We're also deeply committed to supporting local communities, with initiatives to promote small businesses and reduce food waste.</p>
              
              <p>At Roadrunner, we believe that food is more than just sustenance - it's a celebration of culture, tradition, and community. Every order placed, every meal delivered, is a step towards our vision of connecting Africa through its rich culinary heritage.</p>
              
              <p>As we look to the future, we remain committed to our original mission: delivering not just food, but a taste of Africa's diverse and delicious culinary landscape to doorsteps across the continent. Join us on this exciting journey as we continue to redefine food delivery in Africa, one meal at a time.</p>
            </div>
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
              <p>Begin your culinary journey with our carefully crafted appetizers. From our crispy calamari served with a zesty lemon aioli to our bruschetta topped with vine-ripened tomatoes and fresh basil, each starter is designed to awaken your taste buds. Don't miss our chef's special: a creamy burrata served with grilled peaches, prosciutto, and a drizzle of aged balsamic vinegar.</p>
            </div>
            <img src="/images/food10.jpg" alt="Appetizer" className="highlight-image" />
          </div>
          <div className="highlight">
            <div className="highlight-content">
              <h3>Main Courses</h3>
              <p>Our main courses are the heart of our menu, showcasing the finest ingredients and our chefs' expertise. Try our tender braised short ribs, slow-cooked for 12 hours and served with a velvety potato purée and glazed root vegetables. For seafood lovers, our pan-seared scallops with a cauliflower cream and crispy pancetta offer a perfect balance of flavors and textures.</p>
            </div>
            <img src="/images/food11.webp" alt="Main Course" className="highlight-image" />
          </div>
          <div className="highlight">
            <div className="highlight-content">
              <h3>Desserts</h3>
              <p>No meal is complete without a sweet ending. Indulge in our decadent chocolate lava cake, served warm with a molten center of rich chocolate ganache. For a lighter option, savor our lemon tart with a buttery shortbread crust and a topping of sweet and citrusy lemon curd. Pair your dessert with a perfectly brewed espresso or a glass of dessert wine for a truly memorable dining experience.</p>
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