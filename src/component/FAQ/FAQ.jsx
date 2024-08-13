import React, { useState } from "react";
import "./FAQ.css";

const FAQPage = ({ cart }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Roadrunner Kitchen?",
      answer: "Roadrunner Kitchen is an online food ordering service offering a variety of African dishes delivered to your doorstep.",
    },
    {
      question: "How do I place an order?",
      answer: "To place an order, browse our menu, add items to your cart, and proceed to checkout. Follow the prompts to complete your purchase.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards, as well as online payment methods such as PayPal.",
    },
    {
      question: "Can I track my order?",
      answer: "Yes, once your order is confirmed, you will receive a tracking link via email to monitor the status of your delivery.",
    },
    {
      question: "What is your refund policy?",
      answer: "If you are not satisfied with your order, please contact our customer service within 24 hours for a full refund or replacement.",
    },
  ];

  return (
    <div className="faq-page">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
            <h3 className="faq-question" onClick={() => toggleAnswer(index)}>
              {faq.question}
              <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
            </h3>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;