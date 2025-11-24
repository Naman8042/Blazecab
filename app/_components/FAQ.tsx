"use client";
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

const Accordion = () => {
  return (
    <section className="relative z-20 overflow-hidden bg-red  max-w-7xl mx-auto ">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[520px] text-center lg:mb-20">
              <span className="bg-[#FFB300] text-white px-3 py-1 rounded-full text-xs font-semibold">
                FAQ
              </span>
              <h2 className="text-2xl font-bold text-[#6aa4e0] py-4 md:text-4xl">
                Any Questions? Look Here
              </h2>
              <p className="text-sm font-normal text-gray-500 max-w-xl mx-auto md:text-lg">
                Find quick answers to the most common questions about BlazeCab
                rides, pricing, and policies.
              </p>
            </div>
          </div>
        </div>

        <div className=" flex flex-wrap bg-white">
          <div className="w-full  lg:w-full">
            <AccordionItem
              header="In which cities are Blazecab services available?"
              text="Blazecab operates pan-India, including Delhi, Gurugram, Noida, Mumbai, Bengaluru, and Chennai. We provide both local and outstation rides."
            />
            <AccordionItem
              header="What types of services does Blazecab offer?"
              text={`Blazecab provides:

Airport transfers – pick-up and drop services.

One-way trips – point-to-point rides.

Round trips – hire a cab for a return journey.

Local city cabs – convenient rides within the city.

All-inclusive packages – including driver allowance, tolls, parking, and fuel for hassle-free travel.`}
            />
            <AccordionItem
              header="Can I book a cab for a full day?"
              text="Yes, you can! Blazecab offers daily rentals where you can hire a cab and driver for the whole day according to your schedule."
            />
            <AccordionItem
              header="What are the cancellation and refund policies?"
              text={
                "Blazecab offers flexible cancellation options:\n\n" +
                "Full refund if cancelled before 4 hours of the ride. Only minimal getaway charges (if any) will apply.\n\n" +
                "No refund if cancelled within 4 hours of the ride.\n" +
                "Refunds are processed to the original payment method within 3–5 business days."
              }
            />
            <AccordionItem
              header="What payment options are available?
"
              text="Blazecab accepts cash, UPI (Google Pay, PhonePe, Paytm), and debit/credit cards. Choose whichever is convenient for you.
"
            />
            <AccordionItem
              header="What should I do if there’s an issue during the ride?"
              text="You can contact our 24x7 customer support at +91-7703821374. Any issue during the ride will be addressed immediately by our support team.
"
            />
            <AccordionItem
              header="Are the rides chauffeur-driven?"
              text="Absolutely. All Blazecab rides are chauffeur-driven. Our drivers are professional, well-trained, and ensure a safe and comfortable journey."
            />
            <AccordionItem
              header="Does Blazecab offer weekend trips?"
              text="Yes! We provide cabs for weekend getaways like Shimla, Agra, Jaipur, and Haridwar. Simply select your destination and dates while booking."
            />
            <AccordionItem
              header="Can I make a last-minute booking?"
              text="If a vehicle and driver are available, last-minute bookings are possible. We recommend contacting us quickly to confirm availability."
            />
            <AccordionItem
              header="Are the drivers experienced and are the vehicles clean?"
              text="Yes! All Blazecab drivers are expert and trained, ensuring a safe and smooth ride. Our vehicles are neat, clean, and regularly sanitized for a comfortable travel experience."
            />
            <AccordionItem
              header="How do I book a ride on the Blazecab website?"
              text="Visit www.blazecab.com and fill in your ride details. Our website has a simple and user-friendly interface to make booking hassle-free."
            />
            <AccordionItem
              header=" How do I book an outstation trip in advance?"
              text="You can book online via our website or call our customer care at +91-7703821374. Advance bookings ensure availability of your preferred vehicle and driver."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accordion;

interface AccordionItemInterface {
  header: string;
  text: string;
}

export const AccordionItem = ({ header, text }: AccordionItemInterface) => {
  const [active, setActive] = useState(false);

  const handleToggle = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setActive(!active);
  };

  return (
    <div className="mb-1 w-full border-b ">
      {/* Header */}
      <div
        className="flex items-center w-full cursor-pointer py-2"
        onClick={handleToggle}
      >
        {/* Icon */}

        {/* Question */}
        <h4 className="flex-1 text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
          {header}
        </h4>

        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg 
                   "
        >
          <FaAngleDown
            size={18}
            className={`transform duration-300 ease-in-out ${
              active ? "rotate-180 text-primary" : "text-gray-500"
            }`}
          />
        </div>
      </div>

      {/* Expandable Content */}
      <div
        className={`overflow-hidden pt-2 transition-all duration-500 ease-in-out ${
          active ? "sm:max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4">
          <p className="whitespace-pre-line text-gray-600 dark:text-gray-400 leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};
