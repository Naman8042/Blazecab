"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  const router = useRouter()
  const roundTripCities = [
    {
      start: "Delhi",
      end: "Agra",
    },
    {
      start: "Delhi",
      end: "Manali",
    },
    {
      start: "Mumbai",
      end: "Pune",
    },
    {
      start: "Bengalore",
      end: "Mysore",
    },
    {
      start: "Chennai",
      end: "Tirupati",
    },
    {
      start: "Mumbai",
      end: "Shirdi",
    },
    {
      start: "Kolkata",
      end: "Digha",
    },
  ];

  const oneWayRoutes = [
  {
    "start": "Delhi",
    "end": "Agra"
  },
  {
    "start": "Bengalore",
    "end": "Mysore"
  },
  {
    "start": "Mumbai",
    "end": "Nashik"
  },
  {
    "start": "Chennai",
    "end": "Bengalore"
  },
  {
    "start": "Chandigarh",
    "end": "Manali"
  },
  {
    "start": "Delhi",
    "end": "Haridwar"
  },
  {
    "start": "Bengalore",
    "end": "Ooty"
  }
]


  function onClickHandler(start:string,end:string,rideType:string){
    const pickupDate = new Date();
    const pickupTime = new Date();
    const dropoffDate = new Date(Date.now() + 86400000);

    const queryParams = new URLSearchParams();

    queryParams.append("rideType", rideType.replace(/\s+/g, "-"));
    queryParams.append("pickupLocation", start);
    queryParams.append("dropoffLocation", end);
    queryParams.append("pickupDate", pickupDate.toISOString().replace(/:/g, "-"));
    queryParams.append("pickupTime", pickupTime.getTime().toString());
    queryParams.append("dropoffDate", dropoffDate.toISOString().replace(/:/g, "-"));
    
    const url = `/carride?${queryParams.toString()}`;
    console.log("Navigating to URL:", url);
    router.push(url);
  }

  return (
    <footer className="bg-[#6aa4e0] text-white py-4 sm:py-14">
      <div className="max-w-7xl mx-auto px-6">
        {/* Grid Layout */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <h3 className="text-3xl sm:text-4xl font-bold">Blazecab</h3>

            <ul className="mt-4 space-y-2 text-sm">
              <li>📍 8708 Technology Forest, TX 773</li>
              <li>✉️ Infoseoc@gmail.com</li>
              <li>📞 123-456-7890</li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-4 mt-4">
              <FaFacebookF
                className="cursor-pointer hover:text-blue-200"
                size={20}
              />
              <FaTwitter
                className="cursor-pointer hover:text-blue-200"
                size={20}
              />
              <FaInstagram
                className="cursor-pointer hover:text-blue-200"
                size={20}
              />
              <FaLinkedin
                className="cursor-pointer hover:text-blue-200"
                size={20}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold">Popular Round Trip Routes</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {roundTripCities.map((city, index) => (
                <li key={index} >
                  <div className="hover:underline" onClick={()=>onClickHandler(city.start,city.end,"Round-Trip")}>
                    {city.start} To {city.end}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* One Way Routes */}
          <div>
            <h4 className="text-lg font-semibold">Popular One Way Routes</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {oneWayRoutes.map((route,index) => (
                <li key={index}>
                  <div className="hover:underline" onClick={()=>onClickHandler(route.start,route.end,"One-Way")}>
                    {route.start} To {route.end}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/aboutus" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contactus" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policies
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
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
