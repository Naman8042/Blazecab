"use client";
import { useRideTypeStore } from "../Providers";
import Image from "next/image";
import Oneway from "@/assets/one-way-trip.png";
import Roundtrip from "@/assets/round.png";
import Local from "@/assets/train.png";

const Service = () => {
  return (
    <section className="w-full overflow-hidden">
      <div className="container">
        <div className=" flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-12 max-w-[510px] text-center lg:mb-20">
              <span className="bg-[#FFB300] text-white px-3 py-1 rounded-full text-xs font-semibold">
                Our Services
              </span>
              <h2 className="text-2xl font-bold text-[#6aa4e0] py-4 md:text-4xl">
                What We Offer
              </h2>
              <p className="text-sm font-normal text-gray-500 max-w-xl mx-auto md:text-lg">
                There are many variations of passages of Lorem Ipsum available
                but the majority have suffered alteration in some form.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:max-w-7xl sm:grid-cols-4 mx-auto  py-2">
          <ServiceCard
            title="One Way"
            details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
            icon={Oneway}
          />
          <ServiceCard
            title="Round Trip"
            details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
            icon={Roundtrip}
          />
          <ServiceCard
            title="Local"
            details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
            icon={Local}
          />
          <ServiceCard
            title="Local"
            details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
            icon={Local}
          />
        </div>
      </div>
    </section>
  );
};

export default Service;

const ServiceCard = ({ icon, title, details }) => {
  const setRideType = useRideTypeStore((state) => state.setRideType);

  function onCLickHandler() {
    setRideType(title);
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div
        className="w-full sm:px-4  cursor-pointer"
        onClick={onCLickHandler}
      >
        <div className="rounded-[20px] bg-white p-3 sm:p-8 lg:p-10 shadow-md hover:shadow-xl dark:bg-dark-2 flex flex-col justify-center items-center transition-all duration-300">
          <div className="mb-6 flex h-[60px] w-[60px] sm:h-[70px] sm:w-[70px] items-center justify-center rounded-2xl ">
            <Image src={icon} alt=""/>
          </div>
          <h4 className="text-lg  lg:text-2xl font-medium text-[#6aa4e0] mb-2 text-center">
            {title}
          </h4>
          <p className="text-sm  font-normal text-gray-500 text-center">
            {details}
          </p>
        </div>
      </div>
    </>
  );
};
