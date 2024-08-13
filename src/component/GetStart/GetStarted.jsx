import React, { useState, useEffect } from "react";
import { FaGoogle, FaEnvelope, FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaLinkedin, FaPinterest, FaTiktok, FaReddit, FaWhatsapp } from "react-icons/fa";
import "./GetStarted.css";

const GetStarted = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");

  useEffect(() => {
    // Load Google API
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: 'YOUR_GOOGLE_CLIENT_ID',
        });
      });
    };

    // Load Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : 'YOUR_FACEBOOK_APP_ID',
        cookie     : true,
        xfbml      : true,
        version    : 'v11.0'
      });
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleContinueWithSMS = () => {
    if (phoneNumber.trim() === "") {
      alert("Please enter a valid phone number");
      return;
    }
    console.log(`Sending SMS to ${countryCode}${phoneNumber}`);
    // Implement SMS verification logic here
  };

  const handleContinueWithGoogle = () => {
    window.gapi.auth2.getAuthInstance().signIn().then(
      (googleUser) => {
        const profile = googleUser.getBasicProfile();
        console.log("Google ID: " + profile.getId());
        console.log("Name: " + profile.getName());
        console.log("Email: " + profile.getEmail());
        // Add your logic to handle successful Google sign-in
      },
      (error) => {
        console.error("Google Sign-In Error:", error);
      }
    );
  };

  const handleContinueWithEmail = () => {
    const email = prompt("Please enter your email:");
    if (email) {
      console.log("Continuing with Email:", email);
      // Add your logic to handle email sign-in
    }
  };

  const handleContinueWithSocialMedia = (platform) => {
    window.open(`https://www.${platform}.com`, "_blank");
  };

  return (
    <div className="get-started-modal6">
      {/* <button className="close-button6" onClick={onClose}>&times;</button> */}
      <h2>Welcome</h2>
      <h4>Let's start with your phone number</h4>
      <div className="phone-input6">
        <select 
          className="country-code6"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          <option value="+1">+1 (USA)</option>
          <option value="+44">+44 (UK)</option>
          <option value="+61">+61 (Australia)</option>
          <option value="+86">+86 (China)</option>
          <option value="+33">+33 (France)</option>
          <option value="+49">+49 (Germany)</option>
          <option value="+91">+91 (India)</option>
          <option value="+81">+81 (Japan)</option>
          <option value="+234">+234 (Nigeria)</option>
          <option value="+7">+7 (Russia)</option>
          <option value="+27">+27 (South Africa)</option>
          <option value="+82">+82 (South Korea)</option>
          <option value="+34">+34 (Spain)</option>
          <option value="+90">+90 (Turkey)</option>
          <option value="+971">+971 (UAE)</option>
          <option value="+55">+55 (Brazil)</option>
          <option value="+1-242">+1-242 (Bahamas)</option>
          <option value="+32">+32 (Belgium)</option>
          <option value="+1-246">+1-246 (Barbados)</option>
          <option value="+855">+855 (Cambodia)</option>
          <option value="+20">+20 (Egypt)</option>
          <option value="+30">+30 (Greece)</option>
          <option value="+36">+36 (Hungary)</option>
          <option value="+39">+39 (Italy)</option>
          <option value="+52">+52 (Mexico)</option>
          <option value="+31">+31 (Netherlands)</option>
          <option value="+64">+64 (New Zealand)</option>
          <option value="+47">+47 (Norway)</option>
          <option value="+351">+351 (Portugal)</option>
          <option value="+46">+46 (Sweden)</option>
          <option value="+213">+213 (Algeria)</option>
          <option value="+244">+244 (Angola)</option>
          <option value="+229">+229 (Benin)</option>
          <option value="+267">+267 (Botswana)</option>
          <option value="+226">+226 (Burkina Faso)</option>
          <option value="+257">+257 (Burundi)</option>
          <option value="+237">+237 (Cameroon)</option>
          <option value="+238">+238 (Cape Verde)</option>
          <option value="+236">+236 (Central African Republic)</option>
          <option value="+235">+235 (Chad)</option>
          <option value="+269">+269 (Comoros)</option>
          <option value="+242">+242 (Congo)</option>
          <option value="+243">+243 (Democratic Republic of Congo)</option>
          <option value="+253">+253 (Djibouti)</option>
          <option value="+20">+20 (Egypt)</option>
          <option value="+240">+240 (Equatorial Guinea)</option>
          <option value="+291">+291 (Eritrea)</option>
          <option value="+251">+251 (Ethiopia)</option>
          <option value="+241">+241 (Gabon)</option>
          <option value="+220">+220 (Gambia)</option>
          <option value="+233">+233 (Ghana)</option>
          <option value="+224">+224 (Guinea)</option>
          <option value="+245">+245 (Guinea-Bissau)</option>
          <option value="+225">+225 (Ivory Coast)</option>
          <option value="+254">+254 (Kenya)</option>
          <option value="+266">+266 (Lesotho)</option>
          <option value="+231">+231 (Liberia)</option>
          <option value="+218">+218 (Libya)</option>
          <option value="+261">+261 (Madagascar)</option>
          <option value="+265">+265 (Malawi)</option>
          <option value="+223">+223 (Mali)</option>
          <option value="+222">+222 (Mauritania)</option>
          <option value="+230">+230 (Mauritius)</option>
          <option value="+212">+212 (Morocco)</option>
          <option value="+258">+258 (Mozambique)</option>
          <option value="+264">+264 (Namibia)</option>
          <option value="+227">+227 (Niger)</option>
          <option value="+234">+234 (Nigeria)</option>
          <option value="+250">+250 (Rwanda)</option>
          <option value="+239">+239 (Sao Tome and Principe)</option>
          <option value="+221">+221 (Senegal)</option>
          <option value="+248">+248 (Seychelles)</option>
          <option value="+232">+232 (Sierra Leone)</option>
          <option value="+252">+252 (Somalia)</option>
          <option value="+27">+27 (South Africa)</option>
          <option value="+211">+211 (South Sudan)</option>
          <option value="+249">+249 (Sudan)</option>
          <option value="+268">+268 (Swaziland)</option>
          <option value="+255">+255 (Tanzania)</option>
          <option value="+228">+228 (Togo)</option>
          <option value="+216">+216 (Tunisia)</option>
          <option value="+256">+256 (Uganda)</option>
          <option value="+260">+260 (Zambia)</option>
          <option value="+263">+263 (Zimbabwe)</option>
        </select>
        <input 
          type="tel" 
          placeholder="Enter your phone number" 
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className="continue-options6">
        <button className="continue-sms6" onClick={handleContinueWithSMS}>
          Continue with SMS
        </button>
        <button className="continue-google6" onClick={handleContinueWithGoogle}>
          <FaGoogle color="#DB4437" /> Continue with Google
        </button>
        <button className="continue-email6" onClick={handleContinueWithEmail}>
          <FaEnvelope color="#1A73E8" /> Continue with Email
        </button>
        <button className="continue-facebook6" onClick={() => handleContinueWithSocialMedia('facebook')}>
          <FaFacebook color="#1877F2" /> Continue with Facebook
        </button>
        <button className="continue-instagram6" onClick={() => handleContinueWithSocialMedia('instagram')}>
          <FaInstagram color="#C32AA3" /> Continue with Instagram
        </button>
        <button className="continue-youtube6" onClick={() => handleContinueWithSocialMedia('youtube')}>
          <FaYoutube color="#FF0000" /> Continue with YouTube
        </button>
        <button className="continue-twitter6" onClick={() => handleContinueWithSocialMedia('twitter')}>
          <FaTwitter color="#1DA1F2" /> Continue with Twitter
        </button>
        <button className="continue-linkedin6" onClick={() => handleContinueWithSocialMedia('linkedin')}>
          <FaLinkedin color="#0077B5" /> Continue with LinkedIn
        </button>
        <button className="continue-pinterest6" onClick={() => handleContinueWithSocialMedia('pinterest')}>
          <FaPinterest color="#BD081C" /> Continue with Pinterest
        </button>
        <button className="continue-tiktok6" onClick={() => handleContinueWithSocialMedia('tiktok')}>
          <FaTiktok color="#000000" /> Continue with TikTok
        </button>
        <button className="continue-reddit6" onClick={() => handleContinueWithSocialMedia('reddit')}>
          <FaReddit color="#FF4500" /> Continue with Reddit
        </button>
        <button className="continue-whatsapp6" onClick={() => handleContinueWithSocialMedia('whatsapp')}>
          <FaWhatsapp color="#25D366" /> Continue with WhatsApp
        </button>
      </div>
      <p className="legal-text6">
        By creating an account, you automatically accept our <a href="#">Terms of Service</a>, <a href="#">Privacy Policy</a>, and <a href="#">Cookies Policy</a>.
      </p>
    </div>
  );
};

export default GetStarted;