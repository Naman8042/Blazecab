"use client";  
import Logo from '@/assets/blazecab_logo.jpg';
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const navItems = [
  { name: "Home", path: "/" },
  { name: "Job Specs", path: "/jobspecs" },
  { name: "Projects", path: "/projects" },
  { name: "Job Posts", path: "/job-posts" },
  { name: "Pages", path: "/pages" },
  { name: "Job Submissions", path: "/select" },
  { name: "Contact", path: "/contact-us" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="shadow-md w-full z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo with Responsive Sizing */}
          <Link href="/" className="flex items-center">
            <Image
              src={Logo}
              alt="BlazeCab Logo"
              className="h-10 w-auto sm:h-12 md:h-[55px] md:w-[160px]" 
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-[#1565C0]">
            {navItems.map(({ name, path }) => (
              <Link key={path} href={path} className="hover:text-[#FFB300] transition duration-300">
                {name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-[#1565C0] text-white hover:bg-[#0D47A1]">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-[#FFB300] text-white hover:bg-[#FFA000]">
              <Link href="/signup">Signup</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-800" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="p-4 space-y-4 text-gray-800">
            {navItems.map(({ name, path }) => (
              <Link key={path} href={path} className="block hover:text-[#FFB300] transition duration-300">
                {name}
              </Link>
            ))}

            {/* Auth Buttons for Mobile */}
            <div className="flex flex-col space-y-2 mt-4">
              <Link href="/login" className="text-center text-gray-800 hover:text-[#FFB300] transition duration-300">
                Login
              </Link>
              <Link href="/signup" className="text-center bg-[#FFB300] hover:bg-[#FFA000] text-white px-5 py-2 rounded-lg">
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
