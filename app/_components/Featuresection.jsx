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
            Enjoy a seamless cab booking experience with real-time tracking, secure payments, and professional drivers at your service.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-y-8 gap-x-4 md:gap-x-8 lg:flex-nowrap lg:gap-x-8">
          {/* Feature 1: Partial Payment */}
          <div className="relative w-full text-center max-w-[45%] group sm:w-[45%] md:w-1/2 lg:w-1/4">
            <div className="bg-indigo-50 rounded-lg flex justify-center items-center mb-4 w-16 h-16 mx-auto transition-all duration-500 group-hover:bg-indigo-600">
              <svg className="stroke-indigo-600 transition-all duration-500 group-hover:stroke-white" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 10h18M3 14h12M3 18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4 className="text-lg font-medium text-[#6aa4e0] mb-2">Partial Payment</h4>
            <p className="text-sm font-normal text-gray-500">Book your ride by paying just a small amount upfront. Pay the rest during the journey.</p>
          </div>
          {/* Feature 2: Real-time Tracking */}
          <div className="relative w-full text-center max-w-[45%] group sm:w-[45%] md:w-1/2 lg:w-1/4">
            <div className="bg-pink-50 rounded-lg flex justify-center items-center mb-4 w-16 h-16 mx-auto transition-all duration-500 group-hover:bg-pink-600">
              <svg className="stroke-pink-600 transition-all duration-500 group-hover:stroke-white" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11a2 2 0 100-4 2 2 0 000 4z" strokeWidth="2"/>
              </svg>
            </div>
            <h4 className="text-lg font-medium text-[#6aa4e0] mb-2">Real-time Tracking</h4>
            <p className="text-sm font-normal text-gray-500">Track your driver’s location in real-time from pickup to drop.</p>
          </div>
          {/* Feature 3: Professional Drivers */}
          <div className="relative w-full text-center max-w-[45%] group sm:w-[45%] md:w-1/2 lg:w-1/4">
            <div className="bg-teal-50 rounded-lg flex justify-center items-center mb-4 w-16 h-16 mx-auto transition-all duration-500 group-hover:bg-teal-600">
              <svg className="stroke-teal-600 transition-all duration-500 group-hover:stroke-white" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" strokeWidth="2"/>
              </svg>
            </div>
            <h4 className="text-lg font-medium text-[#6aa4e0] mb-2">Verified Drivers</h4>
            <p className="text-sm font-normal text-gray-500">All drivers are background-verified and trained for your safety and comfort.</p>
          </div>
          {/* Feature 4: Affordable Pricing */}
          <div className="relative w-full text-center max-w-[45%] group sm:w-[45%] md:w-1/2 lg:w-1/4">
            <div className="bg-orange-50 rounded-lg flex justify-center items-center mb-4 w-16 h-16 mx-auto transition-all duration-500 group-hover:bg-orange-600">
              <svg className="stroke-orange-600 transition-all duration-500 group-hover:stroke-white" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v8m0 0l3-3m-3 3l-3-3m9-5a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
              </svg>
            </div>
            <h4 className="text-lg font-medium text-[#6aa4e0] mb-2">Affordable Pricing</h4>
            <p className="text-sm font-normal text-gray-500">Transparent pricing with no hidden charges. Pay only what you see.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Featuresection;