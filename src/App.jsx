// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Header from "./component/Header/Header";
// import HomePage from "./component/HomePage/HomePage";
// import FooterPage from "./component/FooterPage/FooterPage";
// import MenuPage from "./component/MenuPage/MenuPage";
// import CartPage from "./component/CartPage/CartPage";
// import FAQ from "./component/FAQ/FAQ";
// import CheckoutPage from "./component/CheckoutPage/CheckoutPage";
// import ServicePage from "./component/ServicePage/ServicePage";
// import SearchPage from "./component/SearchPage/SearchPage";
// import { EcoProvider } from "./Context/EcomContext";
// import { AuthProvider } from "./Context/AuthContext";
// import LogoutButton from "./component/LogoutPage/LogoutPage";
// import LoginPage from "./component/LoginPage/LoginPage";
// import SignUpPage from "./component/SignUpPage/SignUpPage";
// import GetStarted from "./component/GetStart/GetStarted";
// import AdminPage from "./component/AdminPage/AdminPage";
// import CustomerTracking from "./component/AdminPage/CustomerTracking";
// import ScrollToTop from "./component/ScrollToTop/ScrollToTop";
// import UserPage from "./component/UserPage/UserPage";
// import RestaurantPage from "./component/RestaurantPage/RestaurantPage";
// import RestaurantListingPage from "./component/RestaurantListingPage/RestaurantListingPage";
// import RestaurantDetailsPage from "./component/RestaurantDetails/RestaurantDetailsPage";
// import ThankYouPage from "./component/Thank You/ThankYouPage";
// import PaymentPage from "./component/PaymentPage/PaymentPage";

// function App() {
//   return (
//     <Router>
//       <ScrollToTop />
//       <AuthProvider>
//         <EcoProvider>
//           <ToastContainer />
//           <div className="App">
//             <Header />
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/menu" element={<MenuPage />} />
//               <Route path="/cart" element={<CartPage />} />
//               <Route path="/checkout" element={<CheckoutPage />} />
//               <Route path="/payment" element={<PaymentPage />} />
//               <Route path="/faq" element={<FAQ />} />
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/logout" element={<LogoutButton />} />
//               <Route path="/signup" element={<SignUpPage />} />
//               <Route path="/services" element={<ServicePage />} />
//               <Route path="/getstarted" element={<GetStarted />} />
//               <Route path="/search" element={<SearchPage />} />
//               <Route path="/admin" element={<AdminPage />} />
//               <Route path="/profile" element={<UserPage />} />
//               <Route path="/listing" element={<RestaurantListingPage />} />
//               <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
//               <Route path="/restaurant" element={<RestaurantPage />} />
//               <Route path="/track-order" element={<CustomerTracking />} />
//               <Route path="/thank-you" element={<ThankYouPage />} />
//             </Routes>
//             <FooterPage />
//           </div>
//         </EcoProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;




import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Header from "./component/Header/Header";
import HomePage from "./component/HomePage/HomePage";
import FooterPage from "./component/FooterPage/FooterPage";
import MenuPage from "./component/MenuPage/MenuPage";
import CartPage from "./component/CartPage/CartPage";
import FAQ from "./component/FAQ/FAQ";
import CheckoutPage from "./component/CheckoutPage/CheckoutPage";
import SearchPage from "./component/SearchPage/SearchPage";
import { EcomProvider } from "./Context/EcomContext";
import { AuthProvider } from "./Context/AuthContext";
import LogoutButton from "./component/LogoutPage/LogoutPage";
import LoginPage from "./component/LoginPage/LoginPage";
import SignUpPage from "./component/SignUpPage/SignUpPage";
import GetStarted from "./component/GetStart/GetStarted";
import ScrollToTop from "./component/ScrollToTop/ScrollToTop";
import RestaurantPage from "./component/RestaurantPage/RestaurantPage";
import RestaurantListingPage from "./component/RestaurantListingPage/RestaurantListingPage";
import RestaurantDetailsPage from "./component/RestaurantDetails/RestaurantDetailsPage";
import ThankYouPage from "./component/Thank You/ThankYouPage";
import ProfilePage from "./component/ProfilePage/ProfilePage";
import VerifyPage from "./component/VerificationPage/VerifyPage";


axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request headers:', config.headers);
    return config;
  },
  error => Promise.reject(error)
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <EcomProvider>
          <ToastContainer />
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/logout" element={<LogoutButton />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/getstarted" element={<GetStarted />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/listing" element={<RestaurantListingPage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
              <Route path="/restaurant" element={<RestaurantPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/verification" element={<VerifyPage />} />
            </Routes>
            <FooterPage />
          </div>
        </EcomProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;