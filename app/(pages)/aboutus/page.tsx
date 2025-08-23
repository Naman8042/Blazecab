import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Aboutus1 from "@/assets/businesswoman-travelling-by-car-backseat-reading-text-message-smartphone-while-driving-meeting.jpg";
import Aboutus2 from "@/assets/close-up-man-car-with-map-mobile.jpg";
import Aboutus3 from "@/assets/young-uber-driver-car-interior.jpg";
import { FaRegDotCircle } from "react-icons/fa";

const About1 = () => {
  return (
    <section className="max-w-7xl flex items-center mx-auto overflow-hidden px-4 mb-4  pt-10 md:pt-0 min-h-svh sm:min-h-[calc(100vh-4.25rem)] bg-white dark:bg-dark">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between -mx-4 ">
          {/* Images Column */}
          <div className="w-full px-4 lg:w-6/12 ">
            <div className="flex flex-col items-center -mx-3 sm:-mx-4">
              {/* Left side (two stacked images) */}
              <div className="w-full hidden  sm:flex justify-between gap-5 px-3 sm:px-4">
                <div className="py-3 sm:py-4 w-1/2">
                  <Image
                    src={Aboutus1}
                    alt="Team working"
                    className="w-full h-64 sm:h-48 rounded-2xl object-cover"
                  />
                </div>
                <div className="py-3 sm:py-4 w-1/2">
                  <Image
                    src={Aboutus2}
                    alt=""
                    className="w-full h-64 sm:h-48 rounded-2xl object-cover"
                  />
                </div>
              </div>

              {/* Right side (big single image) */}
              <div className="w-full px-3 sm:px-4 mt-5 sm:mt-0">
                <div className="relative z-10 my-4">
                  <Image
                    src={Aboutus3}
                    alt="Business meeting"
                    className="w-full h-48 rounded-2xl object-cover"
                  />
                  <span className="absolute -right-7 -bottom-7 z-[-1]">
                    {/* SVG pattern (dots) */}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="w-full px-4 lg:w-1/2 xl:w-5/12 ">
            <div className="md:mt-10 lg:mt-0 flex flex-col gap-5">
              <span className="bg-[#FFB300] mx-auto sm:mx-0 text-white px-3 rounded-full text-xs font-semibold w-fit py-1">
                Why Choose Us
              </span>
              <h2 className="text-2xl font-bold text-[#6aa4e0] md:text-4xl text-center sm:text-start">
                Make Your Travel Easy & Comfortable with BlazeCab
              </h2>
              <p className="text-base font-normal text-gray-500 max-w-xl mx-auto md:text-lg">
                At BlazeCab, we’re not just about cabs — we’re about creating
                hassle-free travel experiences. Whether it’s a local ride,
                airport transfer, or an outstation trip, our reliable cab rental
                service ensures that you reach your destination safely,
                comfortably, and on time.
              </p>
              <div className="text-sm font-normal text-gray-500 max-w-xl mx-auto md:text-base space-y-4">
                <div className="flex gap-3 items-start">
                  <FaRegDotCircle className="w-6 h-6 flex-shrink-0 text-gray-600 mt-1" />
                  <p>
                    24x7 Availability – Book anytime, anywhere across India.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <FaRegDotCircle className="w-6 h-6 flex-shrink-0 text-gray-600 mt-1" />
                  <p>
                    Partial Payment - Book your ride by paying just a small amount upfront. Pay the rest during the journey.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <FaRegDotCircle className="w-6 h-6 flex-shrink-0 text-gray-600 mt-1" />
                  <p>
                    Affordable Rentals – Transparent pricing with no hidden
                    charges.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <FaRegDotCircle className="w-6 h-6 flex-shrink-0 text-gray-600 mt-1" />
                  <p>
                    Professional Drivers – Experienced, verified, and
                    customer-friendly chauffeurs.
                  </p>
                </div>
              </div>

      
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About1;
