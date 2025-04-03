"use client";

import { Button } from "@/components/ui/button";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#3D85C6] text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Call to Action */}
        <div className="text-center md:text-left pb-8 border-b border-[#0D47A1] flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold leading-snug">
              Ready to Power up your <br className="hidden md:block" /> Savings and Reliability?
            </h2>
            <p className="text-[#BBDEFB] mt-3 max-w-lg">
              Feel free to customize this paragraph to better reflect the
              specific services offered by your IT solution.
            </p>
          </div>

          {/* Subscription Form */}
          <div className="w-full md:w-1/2 flex flex-col sm:flex-row sm:justify-between items-center gap-3 sm:gap-0">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full sm:w-[72%]  p-3 text-gray-900 rounded-md bg-white"
            />
            <Button className="bg-[#FFB300] w-full sm:w-[26%] text-white hover:bg-[#FFA000] h-12 px-6 py-3 rounded-md font-semibold transition  ">
              Subscribe Now →
            </Button>
          </div>
        </div>

        {/* Footer Content */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold">🚀 BlazeCab</h3>
            <p className="text-[#BBDEFB] mt-2">
              Our goal is to demystify the process, address your concerns, and empower you.
            </p>
            {/* Social Icons */}
            <div className="flex justify-center md:justify-start gap-4 mt-4 flex-wrap">
              <FaFacebookF className="text-[#BBDEFB] hover:text-white cursor-pointer" size={20} />
              <FaTwitter className="text-[#BBDEFB] hover:text-white cursor-pointer" size={20} />
              <FaInstagram className="text-[#BBDEFB] hover:text-white cursor-pointer" size={20} />
              <FaLinkedin className="text-[#BBDEFB] hover:text-white cursor-pointer" size={20} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              {["Direct Hire Solutions", "Recruitment Expertise", "Temp-to-Hire", "Temporary Staffing", "Executive Search"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#BBDEFB] hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 className="text-lg font-semibold">Get in Touch</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-[#BBDEFB]">📍 8708 Technology Forest, TX 773</li>
              <li className="text-[#BBDEFB]">✉️ Infoseoc@gmail.com</li>
              <li className="text-[#BBDEFB]">📞 123-456-7890</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
