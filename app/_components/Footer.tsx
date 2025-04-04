"use client";

import { Button } from "@/components/ui/button";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#3D85C6] text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Footer Content */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-10 px-4 sm:px-6 lg:px-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h3 className="text-2xl font-extrabold text-white">🚀 BlazeCab</h3>
            <p className="text-[#BBDEFB] mt-3 text-sm leading-relaxed max-w-sm">
              Our goal is to demystify the process, address your concerns, and
              empower you.
            </p>

            {/* Contact Info */}
            <div className="mt-5 space-y-1 text-sm text-[#BBDEFB]">
              <p>✉️ info@blazecab.com</p>
              <p>📞 +1 (123) 456-7890</p>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center sm:justify-start gap-5 mt-6 flex-wrap">
              <FaFacebookF
                className="text-[#BBDEFB] hover:text-white transition-colors duration-200 cursor-pointer"
                size={22}
              />
              <FaTwitter
                className="text-[#BBDEFB] hover:text-white transition-colors duration-200 cursor-pointer"
                size={22}
              />
              <FaInstagram
                className="text-[#BBDEFB] hover:text-white transition-colors duration-200 cursor-pointer"
                size={22}
              />
              <FaLinkedin
                className="text-[#BBDEFB] hover:text-white transition-colors duration-200 cursor-pointer"
                size={22}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
