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
              <h3>Grilled Salmon with Lemon Butter Sauce</h3>
              <p>Our exquisite grilled salmon is a testament to culinary perfection. We start with the freshest Atlantic salmon, carefully seasoned with a blend of herbs and spices. The fish is then grilled to perfection, resulting in a crispy exterior while maintaining a tender, flaky interior. The dish is elevated with our signature lemon butter sauce, which adds a bright, citrusy note that perfectly complements the rich flavor of the salmon.</p>
            </div>
            
          </div>
          <div className="dish">
            <img src="/images/food9.webp" alt="Signature Dish 2" className="dish-image" />
            <div className="dish-content">
              <h3>Truffle Risotto with Wild Mushrooms</h3>
              <p>Our truffle risotto is a luxurious dish that showcases the earthy, aromatic flavors of truffles and wild mushrooms. We begin with Arborio rice, slowly cooked to creamy perfection in a rich vegetable broth. A medley of wild mushrooms - including porcini, shiitake, and chanterelles - is sautéed and folded into the risotto, adding depth and texture. The dish is finished with a generous shaving of black truffles, imparting an intense, unmistakable aroma.</p>
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
            <p>Founded in 1985 by Chef Maria Rodriguez, our restaurant has been a labor of love and a testament to culinary excellence for over three decades. Maria's journey began in her grandmother's kitchen in rural Spain, where she first learned the importance of using fresh, local ingredients and cooking with passion.</p>
            <p>After honing her skills in some of Europe's most prestigious kitchens, Maria decided to bring her unique vision of contemporary cuisine with traditional roots to life. She opened our doors with a simple mission: to create a dining experience that not only satisfies the palate but also nourishes the soul.</p>
            <p>Today, under the guidance of Maria and her talented team of chefs, we continue to push culinary boundaries while honoring traditional techniques. Our menu is a reflection of our journey - a harmonious blend of classic flavors and innovative gastronomy.</p>
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