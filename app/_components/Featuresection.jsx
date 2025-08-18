import Rupee from "@/assets/rupee.png";
import Affordable from "@/assets/save.png";
import Support from "@/assets/support.png";
import twentyforseven from "@/assets/24-7.png";
import Image from "next/image";

const Featuresection = () => {
  return (
    <section className="  md:py-">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-14">
          <span className="bg-[#FFB300] text-white px-3 py-1 rounded-full text-xs font-semibold">
            Why Choose Us
          </span>
          <h2 className="text-2xl font-bold text-[#6aa4e0] py-4 md:text-4xl">
            Top Features for Hassle-Free Cab Booking
          </h2>
          <p className="text-sm font-normal text-gray-500 max-w-xl mx-auto md:text-lg">
            Enjoy a seamless cab booking experience with real-time tracking,
            secure payments, and professional drivers at your service.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-y-8 gap-x-4 md:gap-x-8 lg:flex-nowrap lg:gap-x-8">
          {/* Feature 1: Partial Payment */}
          <div className="relative w-full text-center max-w-[45%] group sm:w-[45%] md:w-1/2 lg:w-1/4">
            <div className=" rounded-lg flex justify-center items-center mb-4 w-16 h-16 mx-auto transition-all duration-500 ">
              <Image src={Rupee} alt="" />
            </div>
            <h4 className="text-lg font-medium text-[#6aa4e0] mb-2">
              Partial Payment
            </h4>
            <p className="text-sm font-normal text-gray-500">
              Book your ride by paying just a small amount upfront. Pay the rest
              during the journey.
            </p>
          </div>
          {/* Feature 2: Real-time Tracking */}
          <div className="relative w-full text-center max-w-[45%] group sm:w-[45%] md:w-1/2 lg:w-1/4">
            <div className="rounded-lg flex justify-center items-center mb-4 w-16 h-16 mx-auto transition-all duration-500">
              <Image src={twentyforseven} alt="24/7 Support" />
            </div>
            <h4 className="text-lg font-medium text-[#6aa4e0] mb-2">
              24/7 Support
            </h4>
            <p className="text-sm font-normal text-gray-500">
              Get assistance anytime with our dedicated 24/7 customer support
              team.
            </p>
          </div>

          {/* Feature 3: Professional Drivers */}
          <div className="relative w-full text-center max-w-[45%] group sm:w-[45%] md:w-1/2 lg:w-1/4">
            <div className=" rounded-lg flex justify-center items-center mb-4 w-16 h-16 mx-auto transition-all duration-500 ">
              <Image src={Support} alt="" />
            </div>
            <h4 className="text-lg font-medium text-[#6aa4e0] mb-2">
              Verified Drivers
            </h4>
            <p className="text-sm font-normal text-gray-500">
              All drivers are background-verified and trained for your safety
              and comfort.
            </p>
          </div>
          {/* Feature 4: Affordable Pricing */}
          <div className="relative w-full text-center max-w-[45%] group sm:w-[45%] md:w-1/2 lg:w-1/4">
            <div className=" rounded-lg flex justify-center items-center mb-4 w-16 h-16 mx-auto transition-all duration-500 ">
              <Image src={Affordable} alt="" />
            </div>
            <h4 className="text-lg font-medium text-[#6aa4e0] mb-2">
              Affordable Pricing
            </h4>
            <p className="text-sm font-normal text-gray-500">
              Transparent pricing with no hidden charges. Pay only what you see.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Featuresection;
