"use client";

import Logo from "@/assets/blazecab_logo.jpg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaPhoneAlt } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="shadow-md w-full z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-2">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={Logo}
              alt="BlazeCab Logo"
              className="h-8 w-24 sm:h-10 sm:w-28 md:h-[55px] md:w-[160px]"
            />
          </Link>

          {/* 24x7 Support Button */}
          <div className="flex items-center border border-[#3D85C6] h-9 sm:h-auto rounded-md overflow-hidden text-xs sm:text-sm lg:text-base">
            {/* Left Section */}
            <div className="bg-white px-2 py-1 sm:px-3 sm:py-2 flex items-center gap-1 sm:gap-2 h-full">
              <FaPhoneAlt 
                className="text-[#3D85C6]" 
                size={14}  // Default for small screens
              />
              <span className="text-black font-medium">24x7</span>
            </div>

            {/* Right Section */}
            <a
              href="tel:7703821374"
              className="bg-[#3D85C6] h-full text-center flex items-center  text-white px-3 py-1 sm:px-4 sm:py-2 font-bold text-xs sm:text-sm lg:text-base"
            >
              7703821374
            </a>
          </div>

          {/* Auth Buttons (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-[#3D85C6] text-white hover:bg-[#0D47A1] px-4 py-2">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-[#FFB300] text-white hover:bg-[#FFA000] px-4 py-2">
              <Link href="/signin">Signup</Link>
            </Button>
          </div>

          {/* Mobile Menu Button (Only Login) */}
          <Button className="bg-[#3D85C6] text-white hover:bg-[#0D47A1] md:hidden px-3 py-1 text-xs sm:text-sm">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
