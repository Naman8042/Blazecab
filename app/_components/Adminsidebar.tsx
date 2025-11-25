"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  Menu, 
  X, 
  BookOpen, 
  Map, 
  Car, 
  FileText, 
  LogOut, 
  // LayoutDashboard 
} from "lucide-react";
import Logo from '@/assets/photo_2025-10-13_20-42-02.png'
import Image from "next/image";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Define Navigation Items centrally for easy management
  const navItems = [
    { name: "Bookings", href: "/admin", icon: BookOpen },
    { name: "Routes", href: "/admin/routes", icon: Map },
    { name: "Cars", href: "/admin/cars", icon: Car },
    { name: "SEO Content", href: "/admin/seocontent", icon: FileText },
  ];

  // --- 1. Loading State ---
  if (status === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6aa4e0]"></div>
      </div>
    );
  }

  // --- 2. Unauthenticated State ---
  if (status === "unauthenticated") {
    // Use useEffect or ensure this doesn't cause a loop, but for this snippet direct return is fine
    // ideally this runs in a useEffect, but keeping your structure logic:
    if (typeof window !== 'undefined') {
       toast.error("Please log in to view this page.");
       router.push("/login");
    }
    return null; 
  }

  // --- 3. Authenticated but not Admin ---
  if (status === "authenticated" && !session?.user?.isAdmin) {
    if (typeof window !== 'undefined') {
        toast.error("You are not authorized to view this page.");
        router.push("/"); 
    }
    return null;
  }

  return (
    <>
      {/* --- MOBILE HEADER --- */}
      <div className="sm:hidden flex items-center justify-between bg-white border-b p-4 fixed top-0 left-0 right-0 z-50">
        <Image src={Logo} alt="" width={100} height={100}/>
        {/* <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
          <LayoutDashboard className="text-[#6aa4e0]" />
          <span>Admin</span>
        </div> */}
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- SIDEBAR CONTAINER (Desktop + Mobile Overlay) --- */}
      <aside 
        className={`
          fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 w-64
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0 sm:block
        `}
      >
        <div className="h-full flex flex-col justify-between">
          
          {/* Logo & Nav Links */}
          <div className="px-4 py-6">
            <Image src={Logo} alt="" width={150} height={150} className="mb-8 ml-2"/>
            

            {/* Navigation List */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)} // Close menu on mobile click
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group font-medium
                      ${isActive 
                        ? "bg-[#6aa4e0]/10 text-[#6aa4e0]" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <item.icon 
                      size={20} 
                      className={isActive ? "text-[#6aa4e0]" : "text-gray-400 group-hover:text-gray-600"} 
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Logout (Bottom Section) */}
          <div className="p-4 border-t border-gray-100">
             <div className="flex items-center gap-3 px-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                  {session?.user?.name?.charAt(0) || "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session?.user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session?.user?.email}
                  </p>
                </div>
             </div>

            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

        </div>
      </aside>

      {/* --- OVERLAY FOR MOBILE (closes menu when clicking outside) --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 sm:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;