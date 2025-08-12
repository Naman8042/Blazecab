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
    <div className="shadow-md  w-full z-50 bg-white">
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
          <div className="flex items-center border border-[#6aa4e0] rounded-md overflow-hidden h-8 sm:h-9">
            <div className="bg-white px-2 py-1 flex items-center gap-1 h-full md:gap-2">
              <FaPhoneAlt className="text-[#6aa4e0]" size={12} />
              <span className="text-black font-medium hidden md:inline">
                24x7
              </span>
            </div>
            <a
              href="tel:7703821374"
              className="bg-[#6aa4e0] h-full flex items-center text-white px-2 py-1 font-bold"
            >
              <span className="text-[10px] sm:text-xs md:text-sm">
                7703821374
              </span>
            </a>
          </div>

          {/* Conditional Rendering based on Authentication Status */}
          <div className="flex items-center space-x-2 sm:min-w-28">
            {status === "loading" ? (
              // Show a skeleton loader while authentication status is being checked
              <></>
            ) : session ? (
              // Show user icon if the user is logged in
              <Link href="/dashboard" className="flex items-center justify-end w-full">
                <FaUserCircle className="text-[#6aa4e0] w-7 h-7 sm:w-8 sm:h-8" />
              </Link>
            ) : (
              // Show login/signup buttons if not logged in
              <>
                <Button className="">
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="bg-[#FFB300] text-white hover:bg-[#FFA000] hidden sm:block">
                  <Link href="/signin">Signup</Link>
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