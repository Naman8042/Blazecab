const Howitworks = () => {
  return (
    <section className="py- relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full flex-col justify-start items-center gap-10 flex">
          {/* Header Section */}
          <div className="w-full flex-col justify-start items-center gap-2 flex">
            <h2 className="w-full text-center text-[#6aa4e0] text-2xl md:text-4xl font-bold font-manrope leading-normal">
              How It Works
            </h2>
            <p className="w-full text-center text-gray-500 text-sm md:text-base font-normal leading-relaxed max-w-xl mx-auto">
              Booking a cab with us is quick and easy. Just follow these simple steps and hit the road stress-free.
            </p>
          </div>
          {/* Steps Section */}
          <div className="w-full flex flex-col justify-start items-center gap-8 md:flex-row md:gap-4 lg:gap-8">
            {/* Step 1 */}
            <div className="grow shrink basis-0 flex-col justify-start items-center gap-2.5 inline-flex">
              <div className="self-stretch flex-col justify-start items-center gap-0.5 flex">
                <h3 className="text-[#6aa4e0] text-3xl font-extrabold font-manrope leading-normal md:text-4xl">1</h3>
                <h4 className="text-center text-[#6aa4e0] text-lg font-semibold leading-8 md:text-xl">Choose Your Ride</h4>
              </div>
              <p className="text-center text-gray-400 text-sm font-normal leading-relaxed max-w-xs">
                Select your pickup and drop location, date, and type of cab. Whether local, outstation, or airport — we’ve got you covered.
              </p>
            </div>
            {/* Arrow for tablet and desktop */}
            <svg className="hidden md:block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5.5 6L11.5 12L5.5 18M12.5 6L18.5 12L12.5 18" stroke="#6aa4e0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Arrow for mobile */}
            <svg className="md:hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" transform="rotate(90)">
              <path d="M5.5 6L11.5 12L5.5 18M12.5 6L18.5 12L12.5 18" stroke="#6aa4e0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Step 2 */}
            <div className="grow shrink basis-0 flex-col justify-start items-center gap-2.5 inline-flex">
              <div className="self-stretch flex-col justify-start items-center gap-0.5 flex">
                <h3 className="text-[#6aa4e0] text-3xl font-extrabold font-manrope leading-normal md:text-4xl">2</h3>
                <h4 className="text-center text-[#6aa4e0] text-lg font-semibold leading-8 md:text-xl">Confirm & Pay</h4>
              </div>
              <p className="text-center text-gray-400 text-sm font-normal leading-relaxed max-w-xs">
                Review your ride details, choose to pay partially or fully, and confirm your booking. Get instant confirmation via SMS/email.
              </p>
            </div>
            {/* Arrow for tablet and desktop */}
            <svg className="hidden md:block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5.5 6L11.5 12L5.5 18M12.5 6L18.5 12L12.5 18" stroke="#6aa4e0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Arrow for mobile */}
            <svg className="md:hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" transform="rotate(90)">
              <path d="M5.5 6L11.5 12L5.5 18M12.5 6L18.5 12L12.5 18" stroke="#6aa4e0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Step 3 */}
            <div className="grow shrink basis-0 flex-col justify-start items-center gap-2.5 inline-flex">
              <div className="self-stretch flex-col justify-start items-center gap-0.5 flex">
                <h3 className="text-[#6aa4e0] text-3xl font-extrabold font-manrope leading-normal md:text-4xl">3</h3>
                <h4 className="text-center text-[#6aa4e0] text-lg font-semibold leading-8 md:text-xl">Enjoy Your Ride</h4>
              </div>
              <p className="text-center text-gray-400 text-sm font-normal leading-relaxed max-w-xs">
                Sit back and relax. Our verified driver will arrive on time and ensure a smooth, safe, and comfortable journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Howitworks;