"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterest,
  FaYoutube,
  FaPhoneAlt,
  FaLinkedin,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const router = useRouter();
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
      start: "Delhi",
      end: "Agra",
    },
    {
      start: "Bengalore",
      end: "Mysore",
    },
    {
      start: "Mumbai",
      end: "Nashik",
    },
    {
      start: "Chennai",
      end: "Bengalore",
    },
    {
      start: "Chandigarh",
      end: "Manali",
    },
    {
      start: "Delhi",
      end: "Haridwar",
    },
    {
      start: "Bengalore",
      end: "Ooty",
    },
  ];

  function onClickHandler(start: string, end: string, rideType: string) {
    const pickupDate = new Date();
    const pickupTime = new Date();
    const dropoffDate = new Date(Date.now() + 86400000);

    const queryParams = new URLSearchParams();

    queryParams.append("rideType", rideType.replace(/\s+/g, "-"));
    queryParams.append("pickupLocation", start);
    queryParams.append("dropoffLocation", end);
    queryParams.append(
      "pickupDate",
      pickupDate.toISOString().replace(/:/g, "-")
    );
    queryParams.append("pickupTime", pickupTime.getTime().toString());
    queryParams.append(
      "dropoffDate",
      dropoffDate.toISOString().replace(/:/g, "-")
    );

    const url = `/carride?${queryParams.toString()}`;
    console.log("Navigating to URL:", url);
    router.push(url);
  }

  return (
    <footer className="bg-[#6aa4e0] text-white py-4 sm:py-14">
      <div className="max-w-7xl mx-auto px-6 ">
        <div className="sm:hidden gap-6 mt-4 flex justify-center w-full ">
          <Link href={"https://www.facebook.com/blazecab/"}>
            <FaFacebookF
              className="cursor-pointer hover:text-blue-200"
              size={20}
            />
          </Link>
          <Link href={"https://twitter.com/BlazeCab/"}>
            <FaTwitter
              className="cursor-pointer hover:text-blue-200"
              size={20}
            />
          </Link>

          <Link href={"https://www.instagram.com/blazecabs/"}>
            <FaInstagram
              className="cursor-pointer hover:text-blue-200"
              size={20}
            />
          </Link>

          <Link
            href={
              "https://www.linkedin.com/company/blazecab-car-on-rent-in-all-over-india/"
            }
          >
            <FaLinkedin
              className="cursor-pointer hover:text-blue-200"
              size={20}
            />
          </Link>
          <Link href={"https://in.pinterest.com/blazecabcarrentals/"}>
            <FaPinterest
              className="cursor-pointer hover:text-blue-200"
              size={20}
            />
          </Link>
          <Link href={"https://www.youtube.com/c/blazecab"}>
            <FaYoutube
              className="cursor-pointer hover:text-blue-200"
              size={20}
            />
          </Link>
        </div>
        {/* Grid Layout */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <h3 className="text-xl sm:text-4xl font-bold">Blazecab</h3>

            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex gap-1 items-start ">
                <FaMapMarkerAlt className="text-white" size={17} />{" "}
                <span className=" max-w-[260px]">
                  A194 3rd Floor, A Block, Block F, Sudershan Park, New Delhi,
                  Delhi, 110015, India
                </span>
              </li>
              <li className="flex gap-1 items-center">
                <MdEmail className="text-white" size={17} /> info@blazeCab.com
              </li>
              <li className="flex gap-1 items-center">
                <FaPhoneAlt className="text-white" size={17} />
                7703821374
              </li>
            </ul>

            {/* Social Icons */}
            <div className="sm:flex gap-4 mt-4 hidden">
              <Link href={"https://www.facebook.com/blazecab/"}>
                <FaFacebookF
                  className="cursor-pointer hover:text-blue-200"
                  size={20}
                />
              </Link>
              <Link href={"https://twitter.com/BlazeCab/"}>
                <FaTwitter
                  className="cursor-pointer hover:text-blue-200"
                  size={20}
                />
              </Link>

              <Link href={"https://www.instagram.com/blazecabs/"}>
                <FaInstagram
                  className="cursor-pointer hover:text-blue-200"
                  size={20}
                />
              </Link>

              <Link
                href={
                  "https://www.linkedin.com/company/blazecab-car-on-rent-in-all-over-india/"
                }
              >
                <FaLinkedin
                  className="cursor-pointer hover:text-blue-200"
                  size={20}
                />
              </Link>
              <Link href={"https://in.pinterest.com/blazecabcarrentals/"}>
                <FaPinterest
                  className="cursor-pointer hover:text-blue-200"
                  size={20}
                />
              </Link>
              <Link href={"https://www.youtube.com/c/blazecab"}>
                <FaYoutube
                  className="cursor-pointer hover:text-blue-200"
                  size={20}
                />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold">Popular Round Trip Routes</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {roundTripCities.map((city, index) => (
                <li key={index}>
                  <div
                    className="hover:underline"
                    onClick={() =>
                      onClickHandler(city.start, city.end, "Round-Trip")
                    }
                  >
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
              {oneWayRoutes.map((route, index) => (
                <li key={index}>
                  <div
                    className="hover:underline"
                    onClick={() =>
                      onClickHandler(route.start, route.end, "One-Way")
                    }
                  >
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
