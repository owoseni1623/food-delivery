import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faHandshake, faClock, faUserTie, faChartLine, faComments } from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import "./ServicePage.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ReassuranceServicePage = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Orders per month',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="reassurance-service-page5">
      <header className="hero-section5">
        <div className="hero-background5"></div>
        <div className="hero-content5">
          <h1>Your Peace of Mind is Our Priority</h1>
          <p>Roadrunner Foods: Committed to Excellence in Food Delivery and Customer Satisfaction</p>
        </div>
      </header>

      <section className="testimonials5">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-carousel5">
          <div className="testimonial5">
            <p>"Roadrunner Foods has revolutionized my dining experience. Their app is intuitive, the delivery is always on time, and the food quality is consistently excellent. It's my go-to for both quick lunches and special dinner occasions."</p>
            <p className="customer-name5">- Sarah J., Lagos</p>
          </div>
          <div className="testimonial5">
            <p>"As a busy professional, I rely on Roadrunner Foods for most of my meals. Their wide range of restaurant options and reliable service have made my life so much easier. Plus, their customer support is top-notch – they once resolved an issue I had within minutes!"</p>
            <p className="customer-name5">- Michael O., Abuja</p>
          </div>
          <div className="testimonial5">
            <p>"I was skeptical about food delivery services, but Roadrunner Foods changed my mind. The food always arrives hot and fresh, and their eco-friendly packaging initiative really resonates with my values. It's great to see a company that cares about both its customers and the environment."</p>
            <p className="customer-name5">- Amina K., Port Harcourt</p>
          </div>
          <div className="testimonial5">
            <p>"What sets Roadrunner Foods apart is their commitment to local businesses. I love that I can support my favorite local restaurants through their platform. It's convenience with a conscience!"</p>
            <p className="customer-name5">- Chidi E., Enugu</p>
          </div>
          <div className="testimonial5">
            <p>"The variety on Roadrunner Foods is unmatched. From traditional Nigerian cuisine to international flavors, I can always find exactly what I'm craving. Their special dietary options are a lifesaver for someone with food allergies like me."</p>
            <p className="customer-name5">- Fatima L., Kano</p>
          </div>
          <div className="testimonial5">
            <p>"I've used many food delivery services, but Roadrunner Foods stands out for their transparency. I appreciate the detailed breakdown of charges and the real-time tracking feature. It gives me peace of mind knowing exactly where my order is and when it will arrive."</p>
            <p className="customer-name5">- Oluwaseun A., Ibadan</p>
          </div>
          <div className="testimonial5">
            <p>"As a student, I often order late-night meals during study sessions. Roadrunner Foods' 24/7 service and affordable options have been a game-changer. Their student discounts are the cherry on top!"</p>
            <p className="customer-name5">- Emeka N., Calabar</p>
          </div>
          <div className="testimonial5">
            <p>"I was impressed by how Roadrunner Foods handled a mix-up with my order. Not only did they quickly send the correct item, but they also let me keep the wrong one as a courtesy. That level of customer service earned my loyalty."</p>
            <p className="customer-name5">- Blessing O., Benin City</p>
          </div>
          <div className="testimonial5">
            <p>"The Roadrunner Foods app is a joy to use. It's fast, intuitive, and the personalized recommendations are spot on. I've discovered so many great local eateries through their platform."</p>
            <p className="customer-name5">- Yusuf M., Kaduna</p>
          </div>
          <div className="testimonial5">
            <p>"As a restaurant owner partnered with Roadrunner Foods, I can attest to their professionalism and commitment to quality. They've significantly expanded our customer base and their driver training ensures our food is delivered in perfect condition."</p>
            <p className="customer-name5">- Chef Nneka I., Owerri</p>
          </div>
        </div>
      </section>

      <section className="quality-assurance5">
        <h2>Our Commitment to Quality</h2>
        <p>At Roadrunner Foods, we go above and beyond to ensure the highest standards of food quality and service:</p>
        <ul>
          <li>Rigorous vendor vetting process</li>
          <li>Regular quality checks and audits</li>
          <li>Strict adherence to food safety regulations</li>
          <li>Eco-friendly packaging initiatives</li>
          <li>Continuous training for our delivery partners</li>
        </ul>
      </section>

      <section className="customer-support5">
        <h2>24/7 Customer Support</h2>
        <p>Our dedicated team is always here for you:</p>
        <div className="support-options5">
          <div className="support-card5">
            <FontAwesomeIcon icon={faComments} className="icon5" />
            <h3>Live Chat</h3>
            <p>Get instant answers to your queries</p>
          </div>
          <div className="support-card5">
            <FontAwesomeIcon icon={faUserTie} className="icon5" />
            <p>Phone: <a href="tel:+18001234567">+1 (800) 123-4567</a></p>
            <p>Email: <a href="mailto:support@roadrunnerfoods.com">support@roadrunnerfoods.com</a></p>
          </div>
        </div>
      </section>

      <section className="stats5">
        <h2>Our Growth</h2>
        <Line
          ref={chartRef}
          data={data}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </section>

      <section className="transparency5">
        <h2>Transparency in Every Step</h2>
        <p>We believe in keeping you informed throughout your order journey:</p>
        <ul>
          <li>Real-time order tracking</li>
          <li>Detailed breakdown of charges</li>
          <li>Driver information and estimated arrival time</li>
          <li>Post-delivery feedback system</li>
        </ul>
      </section>

      <section className="data-privacy5">
        <h2>Your Data, Your Control</h2>
        <p>We take your privacy seriously:</p>
        <ul>
          <li>GDPR compliant data handling</li>
          <li>Option to delete your account and data</li>
          <li>Transparent cookie and tracking policies</li>
          <li>Regular security audits by third-party experts</li>
        </ul>
      </section>

      <section className="community-impact5">
        <h2>Making a Difference Together</h2>
        <p>When you choose Roadrunner Foods, you're supporting our initiatives:</p>
        <ul>
          <li>Partnership with local food banks to reduce waste</li>
          <li>Support for small, local restaurants</li>
          <li>Carbon-neutral delivery program</li>
          <li>Employee welfare and growth opportunities</li>
        </ul>
      </section>

      <section className="cta5">
        <div className="cta-background5"></div>
        <div className="cta-content5">
          <h2>Experience the Roadrunner Difference</h2>
          <p>Join thousands of satisfied customers who trust us for their food delivery needs.</p>
          <button className="cta-button5">Order Now</button>
        </div>
      </section>
    </div>
  );
};

export default ReassuranceServicePage;