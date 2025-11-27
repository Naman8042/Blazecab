import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  // CONFIGURATION
  const phoneNumber = '7703821374'; 
  const message = 'Hello Blazecab! I would like to book a ride.';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20b857] hover:scale-110 transition-all duration-300 ease-in-out group"
    >
      {/* Icon */}
      <FaWhatsapp size={32} />

      {/* Tooltip Text on Hover */}
      <span className="absolute right-16 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-sm">
        Book a Ride
      </span>
    </a>
  );
};

export default WhatsAppButton;