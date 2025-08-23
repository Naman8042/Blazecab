import React from "react";
import {  FaMapMarkerAlt,FaPhoneAlt} from 'react-icons/fa'
import { MdMail } from "react-icons/md";


const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-gray-700 mt-10 sm:mt-0">
      {/* Title */}
      <h1 className="text-3xl font-bold text-[#6aa4e0] mb-6 text-center sm:text-start">
        Privacy Policy
      </h1>
     
      {/* Section 1 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
        <p className="mb-2">
          When you use <span className="font-bold">BlazeCab</span>, we may collect the following types of information:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><span className="font-medium">Personal Information:</span> Name, phone number, email address, billing address, and payment details when booking a ride.</li>
          <li><span className="font-medium">Location Data:</span> Pickup and drop-off locations, GPS coordinates, and travel history (only while using our service).</li>
          {/* <li><span className="font-medium">Device Information:</span> IP address, browser type, operating system, and device identifiers.</li> */}
          {/* <li><span className="font-medium">Usage Information:</span> Pages you visit, time spent on the site, and booking activity.</li> */}
        </ul>
      </div>

      {/* Section 2 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide and manage ride bookings.</li>
          <li>Process payments securely.</li>
          <li>Improve our services, website, and customer support.</li>
          <li>Send booking confirmations, updates, and service-related notifications.</li>
          <li>Ensure safety, prevent fraud, and comply with legal obligations.</li>
        </ul>
      </div>

      {/* Section 3 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Sharing of Information</h2>
        <p className="mb-2">We do not sell your personal information. However, we may share data in the following cases:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>With drivers to fulfill your ride requests.</li>
          <li>With payment processors to handle transactions.</li>
          <li>With law enforcement or regulators, if required by law.</li>
          <li>With service providers (e.g., hosting, analytics, customer support) under confidentiality agreements.</li>
        </ul>
      </div>

      {/* Section 4 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Cookies & Tracking</h2>
        <p className="mb-2">We may use cookies and similar technologies to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Improve user experience.</li>
          <li>Remember your preferences.</li>
          <li>Analyze site traffic.</li>
        </ul>
        <p className="mt-2">You can disable cookies in your browser settings, but some features may not function properly.</p>
      </div>

      {/* Section 5-11 (shortened for demo, you can expand same pattern) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
        <p>We implement industry-standard measures to protect your data from unauthorized access, loss, or misuse. However, no online system is 100% secure, and we cannot guarantee absolute security.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
        <p>We retain your personal information only as long as necessary for providing services, resolving disputes, or complying with legal obligations.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access, update, or delete your personal information.</li>
          <li>Opt-out of marketing communications.</li>
          <li>Request restriction or objection to certain processing activities.</li>
        </ul>
        <p className="mt-2">To exercise these rights, please contact us.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Third-Party Links</h2>
        <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of such sites.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Children’s Privacy</h2>
        <p>BlazeCab does not knowingly collect personal information from individuals under 18 years of age. If we discover such data, we will delete it promptly.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">10. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated “Effective Date.”</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or our practices, please contact us:</p>
        <ul className="mt-2 space-y-1">
          <li className="flex gap-1 items-center"><MdMail/> info@blazecab.com</li>
          <li className="flex gap-1 items-center"><FaPhoneAlt/> 7703821374</li>
          <li className="flex gap-1 items-center"><FaMapMarkerAlt/> A194 3rd Floor, A Block, Block F, Sudershan Park, New Delhi,
                  Delhi, 110015, India</li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
