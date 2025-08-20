import React from "react";
import { Button } from "@/components/ui/button";

const About1 = () => {
  return (
    <section className="max-w-7xl mx-auto overflow-hidden px-4 mb-4  pt-10 md:pt-0 sm:h-[calc(100vh-4.25rem)] bg-white dark:bg-dark">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between -mx-4">
          
          {/* Images Column */}
          <div className="w-full px-4 lg:w-6/12 hidden md:block">
            <div className="flex items-center -mx-3 sm:-mx-4">
              
              {/* Left side (two stacked images) */}
              <div className="w-full px-3 sm:px-4 xl:w-1/2">
                <div className="py-3 sm:py-4">
                  <img
                    src="https://cdn.tailgrids.com/assets/images/marketing/about/about-01/image-1.jpg"
                    alt="Team working"
                    className="w-full h-64 sm:h-72 md:h-72 rounded-2xl object-cover"
                  />
                </div>
                <div className="py-3 sm:py-4">
                  <img
                    src="https://cdn.tailgrids.com/assets/images/marketing/about/about-01/image-2.jpg"
                    alt="Man working"
                    className="w-full h-64 sm:h-72 md:h-72 rounded-2xl object-cover"
                  />
                </div>
              </div>

              {/* Right side (big single image) */}
              <div className="w-full px-3 sm:px-4 xl:w-1/2">
                <div className="relative z-10 my-4">
                  <img
                    src="https://cdn.tailgrids.com/assets/images/marketing/about/about-01/image-3.jpg"
                    alt="Business meeting"
                    className="w-full h-full min-h-80 rounded-2xl object-cover"
                  />
                  <span className="absolute -right-7 -bottom-7 z-[-1]">
                    {/* SVG pattern (dots) */}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Text Column */}
          <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
            <div className="mt-10 lg:mt-0 flex flex-col gap-5">
              <span className="bg-[#FFB300] mx-auto sm:mx-0 text-white px-3 rounded-full text-xs font-semibold w-fit py-1">
                Why Choose Us
              </span>
              <h2 className="text-2xl font-bold text-[#6aa4e0] md:text-4xl text-center sm:text-start">
                Make your customers happy by giving services.
              </h2>
              <p className="text-sm font-normal text-gray-500 max-w-xl mx-auto md:text-lg">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p>
              <p className="text-sm font-normal text-gray-500 max-w-xl mx-auto md:text-lg">
                A domain name is one of the first steps to establishing your
                brand. Secure a consistent brand image with a domain name that
                matches your business.
              </p>
              <Button>
                Get Started
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About1;
