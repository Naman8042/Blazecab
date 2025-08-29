"use client";

import Logo from "@/assets/blazecab_logo.webp";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaPhoneAlt, FaUserCircle } from "react-icons/fa"; // Import FaUserCircle
import { useSession } from "next-auth/react";
// import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a skeleton component for loading state

const Navbar = () => {
  // Use the useSession hook to get the user's session data and status
  const { data: session, status } = useSession();

  return (
    <div className="absolute top-0 sm:relative shadow-md  w-full z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-1 sm:py-2">
        <div className="flex justify-between items-center h-14 gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={Logo}
              alt="BlazeCab Logo"
              className="w-28 h-10 sm:w-32 md:h-[55px] md:w-[160px]"
            />
          </Link>

          {/* 24x7 Support Button - Centered and Styled */}
          <div className="flex items-center border border-[#6aa4e0] rounded-md overflow-hidden h-8 sm:h-9 min-w-[120px] sm:min-w-[140px]">
  {/* Icon box - auto width */}
  <div className="bg-white px-2 flex items-center justify-center">
    <FaPhoneAlt className="text-[#6aa4e0]" size={12} />
  </div>

  {/* Phone number box - takes remaining width */}
  <a
    href="tel:7703821374"
    className="bg-[#6aa4e0] flex-1 h-full flex items-center justify-center text-white px-2 font-bold"
  >
    <span className="text-[10px] sm:text-xs md:text-sm">
      7703821374
    </span>
  </a>
</div>


          {/* Conditional Rendering based on Authentication Status */}
          <div className="flex items-center space-x-2 min-w-16 sm:min-w-40  justify-end">
            {status === "loading" ? (
              // Show a skeleton loader while authentication status is being checked
              <div className=""></div>
            ) : session ? (
              // Show user icon if the user is logged in
              <Link href="/dashboard" className="flex items-center justify-end w-full">
                <FaUserCircle className="text-[#6aa4e0] w-7 h-7 sm:w-8 sm:h-8" />
              </Link>
            ) : (
              // Show login/signup buttons if not logged in
              <>
                <Button className="text-[10px] sm:text-xs md:text-sm h-8 sm:h-9">
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="bg-[#FFB300] text-white hover:bg-[#FFA000] hidden sm:block">
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