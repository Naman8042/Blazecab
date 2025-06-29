"use client";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#6aa4e0] text-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-start">
          {/* Brand Info */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-5">
            <h3 className="text-3xl font-bold tracking-wide">🚀 BlazeCab</h3>
            <p className="text-blue-100 text-base max-w-md leading-relaxed">
              Our goal is to demystify the process, address your concerns, and empower you.
            </p>
            <div className="text-sm text-blue-100 space-y-1">
              <p>✉️ info@blazecab.com</p>
              <p>📞 +1 (123) 456-7890</p>
            </div>
            <div className="flex gap-4 mt-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <Icon
                  key={i}
                  size={22}
                  className="text-blue-100 hover:text-white transition-colors duration-300 cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
        {/* Bottom Text */}
        <div className="border-t border-white/20 mt-12 pt-6 text-sm text-blue-100 text-center">
          &copy; {new Date().getFullYear()} BlazeCab. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
