"use client";

import Logo from "@/assets/blazecab_logo.webp";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaPhoneAlt } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="shadow-md mb-0.5  w-full z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-2">
        <div className="flex justify-between items-center h-14 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={Logo}
              alt="BlazeCab Logo"
              className="h-8 w-32 sm:h-10 sm:w-32 md:h-[55px] md:w-[160px]"
            />
          </Link>

          {/* 24x7 Support Button - Scaled Down on Mobile */}
          <div className="flex items-center border border-[#6aa4e0] rounded-md overflow-hidden text-[10px] sm:text-xs md:text-sm lg:text-base h-8 sm:h-9">
            <div className="bg-white px-2 py-1 flex items-center gap-1 sm:gap-2 h-full">
              <FaPhoneAlt className="text-[#6aa4e0]" size={12} />
              <span className="text-black font-medium">24x7</span>
            </div>
            <a
              href="tel:7703821374"
              className="bg-[#6aa4e0] h-full text-center flex items-center text-white px-2 py-1 font-bold"
            >
              <span className="text-[10px] sm:text-xs md:text-sm">7703821374</span>
            </a>
          </div>

          {/* Auth Buttons - Scaled Down Login Always Visible */}
          <div className="hidden md:flex items-center space-x-2">
            <Button className="bg-[#6aa4e0] text-white hover:bg-[#0D47A1] px-3 py-1 text-sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-[#FFB300] text-white hover:bg-[#FFA000] px-3 py-1 text-sm">
              <Link href="/signin">Signup</Link>
            </Button>
          </div>

          {/* Mobile Login (already compact) */}
          <div className="md:hidden">
            <Button className="bg-[#6aa4e0] text-white hover:bg-[#0D47A1] px-4 py-1 h-8 text-[10px] sm:text-xs">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
