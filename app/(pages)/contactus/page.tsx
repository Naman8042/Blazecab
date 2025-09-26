import React from "react";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { IoIosCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";

const Contact = () => {
  return (
    <>
      <section className="max-w-7xl pt-16 sm:pt-0 relative z-10 overflow-hidden bg-white  mx-auto min-h-svh flex items-center sm:min-h-[calc(100vh-4.25rem)] ">
        <div className="container p-4 sm:p-0">
          <div className="-mx-4 flex flex-wrap gap-8 sm:gap-0 lg:justify-between">
            <div className="w-full px-4 lg:w-1/2 xl:w-6/12">
              <div className="flex flex-col gap-5 max-w-[570px] lg:mb-0">
                <span className="bg-[#FFB300] mx-auto sm:mx-0 text-white px-3 rounded-full text-xs font-semibold w-fit py-1">
                  Contact Us
                </span>
                <h2 className="text-2xl font-bold text-[#6aa4e0] md:text-4xl text-center sm:text-start">
                  GET IN TOUCH WITH US
                </h2>
                <p className="text-sm font-normal text-gray-500 max-w-xl mx-auto md:text-lg">
                   Have questions about our services, pricing, or bookings? Our team is always 
  here to help you with quick assistance. Reach out by phone, email, or visit 
  our office, and we’ll be glad to assist you.
                </p>
                <div className=" flex w-full max-w-[400px] items-center">
                  <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
                    <HiMiniBuildingOffice size={30} className="text-gray-500"/>
                  </div>
                  <div className="w-full">
                    <h4 className="mb-1 text-[#6aa4e0] text-xl font-bold text-dark dark:text-white">
                      Our Location
                    </h4>
                    <p className="text-base text-gray-500 text-body-color dark:text-dark-6">
                       A194 3rd Floor, A Block, Block F, Sudershan Park, New Delhi, Delhi, 110015, India
                    </p>
                  </div>
                </div>

                <div className=" flex w-full max-w-[400px] items-center">
                  <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
                    <IoIosCall size={30} className="text-gray-500"/>
                  </div>
                  <div className="w-full">
                    <h4 className="mb-1 text-[#6aa4e0] text-xl font-bold text-dark dark:text-white">
                      Phone Number
                    </h4>
                    <p className="text-base text-gray-500 text-body-color dark:text-dark-6">
                      (+91) 7703821374
                    </p>
                  </div>
                </div>

                <div className="flex w-full max-w-[400px] items-center">
                  <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
                    <MdEmail size={30} className="text-gray-500"/>
                  </div>
                  <div className="w-full">
                    <h4 className="mb-1 text-[#6aa4e0] text-xl font-bold text-dark dark:text-white">
                      Email Address
                    </h4>
                    <p className="text-base text-gray-500 text-body-color dark:text-dark-6">
                      info@blazeCab.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2 xl:w-5/12 flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.865695042395!2d77.1342055!3d28.663739800000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03d31d064b61%3A0xf2a2681f60b1d13c!2sBlazeCab%20-%20Best%20Taxi%20Service%20In%20India!5e0!3m2!1sen!2spl!4v1755583470667!5m2!1sen!2spl"
                width="500"
                height="450"
                // style={"border:0;"}
                // allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
