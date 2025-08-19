"use client"
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

const Accordion = () => {
  return (
    <section className="relative z-20 overflow-hidden px-4 sm:px-0 max-w-7xl mx-auto">
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
                There are many variations of passages of Lorem Ipsum available
                but the majority have suffered alteration in some form.
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap bg-white">
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              header="How long we deliver your first blog post?"
              text="It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available ."
            />
            <AccordionItem
              header="How long we deliver your first blog post?"
              text="It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available ."
            />
            <AccordionItem
              header="How long we deliver your first blog post?"
              text="It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available ."
            />
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              header="How long we deliver your first blog post?"
              text="It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available ."
            />
            <AccordionItem
              header="How long we deliver your first blog post?"
              text="It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available ."
            />
            <AccordionItem
              header="How long we deliver your first blog post?"
              text="It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available ."
            />
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default Accordion;

interface AccordionItemInterface{
  header:string,
  text:string
}

const AccordionItem = ({ header, text }:AccordionItemInterface) => {
  const [active, setActive] = useState(false);

  const handleToggle = (event: React.SyntheticEvent) => {
  event.preventDefault();
  setActive(!active);
};


  return (
    <div className="mb-8 w-full rounded-lg bg-white p-4 sm:p-8 lg:px-6 xl:px-8 shadow-md border">
      {/* Header Row */}
      <div
        className="faq-btn flex items-center justify-center text-left  w-full cursor-pointer"
        onClick={handleToggle}
      >
        {/* Icon */}
        <div className="mr-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary dark:bg-white/5">
          <FaAngleDown
            size={20}
            className={` text-gray-500  duration-200 ease-in-out  ${
              active ? "rotate-180" : ""
            }`}
            />
        </div>

        {/* Text */}
        <div className="flex-1 ">
          <h4 className="mt-1 text-lg font-semibold text-dark text-gray-500 dark:text-white">
            {header}
          </h4>
        </div>
      </div>

      {/* Expandable Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          active ? "max-h-40 opacity-100 " : "max-h-0 opacity-0"
        }`}
      >
        <p className="py-3 px-2 text-base leading-relaxed text-body-color text-gray-500">
          {text}
        </p>
      </div>
    </div>
  );
};