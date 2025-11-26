"use client";

import Logo from "@/assets/photo_2025-10-13_20-42-02.png";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, UserCircle,BookOpen, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log(session)
  useEffect(() => {
    setIsMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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
              <Phone className="text-[#6aa4e0]" size={12} />
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
            {!isMounted ? (
              // Loading Skeleton
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              // Logged In: Dropdown Menu
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    {/* User Avatar - Removed Border and Arrow */}
                    {session.user?.avatar ? (
                        <Image 
                            src={session.user.avatar} 
                            alt="User" 
                            width={32} 
                            height={32} 
                            className="rounded-full w-8 h-8 object-cover"
                        />
                    ) : (
                        <UserCircle className="text-[#6aa4e0] w-7 h-7 sm:w-8 sm:h-8" />
                     )} 
                </button>

                {/* Dropdown Content */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg  z-50 overflow-hidden origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* User Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {/* <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#6aa4e0]/10 hover:text-[#6aa4e0] transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        Profile
                      </Link> */}
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#6aa4e0]/10 hover:text-[#6aa4e0] transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        My Bookings
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Logged Out Buttons
              <>
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