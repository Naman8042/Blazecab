"use client";

import Logo from "@/assets/photo_2025-10-13_20-42-02.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaPhoneAlt, FaUserCircle } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { data: session} = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="absolute top-0 sm:relative shadow-md w-full z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-1 sm:py-2">
        <div className="flex justify-between items-center h-14 gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={Logo}
              alt="BlazeCab Logo"
              className="w-[110px] sm:w-28 md:w-40 h-auto"
            />
          </Link>

          {/* 24x7 Support Button */}
          <div className="flex items-center border border-[#6aa4e0] rounded-md overflow-hidden h-8 sm:h-9 min-w-[120px] sm:min-w-[140px]">
            <div className="bg-white px-2 flex items-center justify-center">
              <FaPhoneAlt className="text-[#6aa4e0]" size={12} />
            </div>
            <a
              href="tel:7703821374"
              className="bg-[#6aa4e0] flex-1 h-full flex items-center justify-center text-white px-2 font-bold"
            >
              <span className="text-[10px] sm:text-xs md:text-sm">
                7703821374
              </span>
            </a>
          </div>

          {/* Authentication Status */}
          <div className="flex items-center space-x-2 sm:min-w-40 justify-end">
            {/* ✨ 1. The Robust Hydration Fix */}
            {!isMounted ? (
              // On server and initial client render, show a placeholder
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              // After mounting on client, if logged in, show user icon
              <Link
                href="/dashboard"
                className="flex items-center justify-end w-full"
              >
                <FaUserCircle className="text-[#6aa4e0] w-7 h-7 sm:w-8 sm:h-8" />
              </Link>
            ) : (
              // After mounting on client, if not logged in, show buttons
              <>
                {/* ✨ 2. The HTML Fix using asChild */}
                <Button asChild className="text-[10px] sm:text-xs md:text-sm h-8 sm:h-9">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-[#FFB300] text-white hover:bg-[#FFA000] hidden sm:block">
                  <Link href="/signup">Signup</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;