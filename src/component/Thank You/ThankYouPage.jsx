import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEcom } from "../../Context/EcomContext";
import axios from "axios";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Lottie from "react-lottie";
import successAnimation from "./success-animation.json";
import confetti from "canvas-confetti";
import { QRCode } from "react-qr-code";
import { CountUp } from "react-countup";
import { FacebookShareButton, LinkedinShareButton, WhatsappShareButton, EmailShareButton, TwitterShareButton, FacebookIcon, LinkedinIcon, WhatsappIcon, EmailIcon, TwitterIcon } from "react-share";
import "./ThankYouPage.css";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const { apiUrl } = useEcom();
  const confettiRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const searchParams = new URLSearchParams(location.search);
      const transactionId = searchParams.get("transaction_id");

      if (!transactionId) {
        setOrderDetails({ generic: true });
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/api/verify?transaction_id=${transactionId}`);

        if (response.data.success) {
          setOrderDetails(response.data.data);
          triggerConfetti();
        } else {
          setOrderDetails({ generic: true });
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setOrderDetails({ generic: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location, apiUrl]);

  useEffect(() => {
    if (!isLoading) {
      controls.start(i => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1 }
      }));
    }
  }, [isLoading, controls]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  if (isLoading) {
    return (
      <div className="loading" aria-live="polite">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p>Processing your order...</p>
          <div className="spinner"></div>
        </motion.div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const title = "I just made an amazing purchase!";

  return (
    <>
      <Helmet>
        <title>Thank You for Your Order | Your Store Name</title>
        <meta name="description" content="Your order has been successfully placed." />
      </Helmet>
      <div className="thank-you-page" ref={confettiRef}>
        <AnimatePresence>
          <motion.div
            className="thank-you-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h1>🎉 Thank You for Your Order! 🎉</h1>
            <div className="order-success">
              <Lottie options={defaultOptions} height={200} width={200} />
              <p>Your order has been successfully placed.</p>
            </div>
            {orderDetails && !orderDetails.generic && (
              <motion.div
                className="order-details"
                initial={{ opacity: 0 }}
                animate={controls}
                custom={1}
              >
                <h2>Order Details</h2>
                <p><strong>Order #:</strong> {orderDetails.txRef || "N/A"}</p>
                <p><strong>Total Amount:</strong> {orderDetails.currency || ""} <CountUp end={orderDetails.amount || 0} decimals={2} duration={2} /></p>
                <p><strong>Name:</strong> {orderDetails.customerName || "N/A"}</p>
                <p><strong>Email:</strong> {orderDetails.customerEmail || "N/A"}</p>
                <p><strong>Status:</strong> <span className="status-success">{orderDetails.paymentStatus || "Completed"}</span></p>
              </motion.div>
            )}
            <motion.div
              className="next-steps"
              initial={{ opacity: 0 }}
              animate={controls}
              custom={2}
            >
              <h3>What's Next?</h3>
              <ul>
                <li>You will receive an email confirmation shortly.</li>
                <li>Your order will be processed and delivered within 4-5 hours.</li>
                <li>For any questions, please contact our customer support.</li>
              </ul>
            </motion.div>
            <motion.div
              className="action-buttons"
              initial={{ opacity: 0 }}
              animate={controls}
              custom={3}
            >
              <motion.button
                onClick={() => navigate("/")}
                className="home-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Shopping
              </motion.button>
              <motion.button
                onClick={() => setShowQR(!showQR)}
                className="qr-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showQR ? "Hide" : "Show"} QR Code
              </motion.button>
            </motion.div>
            <AnimatePresence>
              {showQR && (
                <motion.div
                  className="qr-code"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <QRCode value={`${window.location.origin}/track-order/${orderDetails.txRef}`} />
                  <p>Scan to track your order</p>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              className="social-share"
              initial={{ opacity: 0 }}
              animate={controls}
              custom={4}
            >
              <p>Share your purchase:</p>
              <div className="share-buttons">
                <TwitterShareButton url={shareUrl} title={title}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <FacebookShareButton url={shareUrl} quote={title}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <LinkedinShareButton url={shareUrl} title={title}>
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
                <WhatsappShareButton url={shareUrl} title={title}>
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <EmailShareButton url={shareUrl} subject={title} body="Check out what I just bought!">
                  <EmailIcon size={32} round />
                </EmailShareButton>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default ThankYouPage;