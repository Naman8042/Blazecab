// "use client";
// import { useRideTypeStore } from "../Providers";
// import Image from "next/image";
// import Oneway from "@/assets/one-way-trip.jpg";
// import Roundtrip from "@/assets/round.png";
// import Local from "@/assets/train.png";
// import Airport from '@/assets/airport.png'

// const Service = () => {
//   return (
//     <section className=" overflow-hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//       <div className="container">
//         <div className=" flex flex-wrap">
//           <div className="w-full px-4">
//             <div className="mx-auto mb-12 max-w-[510px] text-center lg:mb-20">
//               <span className="bg-[#FFB300] text-white px-3 py-1 rounded-full text-xs font-semibold">
//                 Our Services
//               </span>
//               <h2 className="text-2xl font-bold text-[#6aa4e0] py-4 md:text-4xl">
//                 What We Offer
//               </h2>
//               <p className="text-sm font-normal text-gray-500 max-w-xl mx-auto md:text-lg">
//                 There are many variations of passages of Lorem Ipsum available
//                 but the majority have suffered alteration in some form.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-wrap justify-center gap-y-8 gap-x-4 md:gap-x-8 lg:flex-nowrap lg:gap-x-8 py-2">
//           <ServiceCard
//             title="One Way"
//             details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
//             icon={Oneway}
//           />
//           <ServiceCard
//             title="Round Trip"
//             details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
//             icon={Roundtrip}
//           />
//           <ServiceCard
//             title="Local"
//             details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
//             icon={Local}
//           />
//           <ServiceCard
//             title="Airport"
//             details="We dejoy working with discerning clients, people for whom qualuty, service, integrity & aesthetics."
//             icon={Airport}
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Service;

// const ServiceCard = ({ icon, title, details }) => {
//   const setRideType = useRideTypeStore((state) => state.setRideType);

//   function onCLickHandler() {
//     setRideType(title);
//     document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
//   }

//   return (
//     <>
//       <div
//         className="w-full text-center max-w-[45%] group sm:w-[45%] md:w-1/2 lg:w-1/4 cursor-pointer"
//         onClick={onCLickHandler}
//       >
//         <div className="rounded-[20px] bg-white p-3 sm:p-8 lg:p-10 shadow-md hover:shadow-xl dark:bg-dark-2 flex flex-col justify-center items-center transition-all duration-300">
//           <div className="mb-6 flex h-[60px] w-[60px] sm:h-[70px] sm:w-[70px] items-center justify-center rounded-2xl ">
//             <Image src={icon} alt=""/>
//           </div>
//           <h4 className="text-lg  lg:text-2xl font-medium text-[#6aa4e0] mb-2 text-center">
//             {title}
//           </h4>
//           <p className="text-sm  font-normal text-gray-500 text-center">
//             {details}
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

import Image from "next/image";
import Oneway from "@/assets/one-way-trip.jpg";
import Roundtrip from "@/assets/round.png";
import Local from "@/assets/train.png";
import Airport from '@/assets/airport.png'

const Service = () => {
  const cards = [
    {
      imageSrc: Oneway,
      title: 'One Way Trip',
      description: 'We Provide Various Methods For You To Carry Out All Transactions Related To Your Finances'
    },
    {
      imageSrc: Roundtrip,
      title: 'Round Trip',
      description: 'We have the most up-to-date security to support the security of all our '
    },
    {
      imageSrc: Local,
      title: 'Local Trip',
      description: 'Provide Customer Service For Those Of You Who Have Problems 24 Hours A Week'
    },
    {
      imageSrc: Airport,
      title: 'Airport',
      description: 'We provide faster transaction speeds than competitors, so money arrives and is received faster.'
    }
  ];


  return (
    <section className="">
      <div className=" flex flex-wrap">
        {" "}
        <div className="w-full px-4">
          {" "}
          <div className="mx-auto mb-12 max-w-[510px] text-center lg:mb-20">
            {" "}
            <span className="bg-[#FFB300] text-white px-3 py-1 rounded-full text-xs font-semibold">
              Our Services{" "}
            </span>{" "}
            <h2 className="text-2xl font-bold text-[#6aa4e0] py-4 md:text-4xl">
              {" "}
              What We Offer{" "}
            </h2>{" "}
            <p className="text-sm font-normal text-gray-500 max-w-xl mx-auto md:text-lg">
              {" "}
              There are many variations of passages of Lorem Ipsum available but
              the majority have suffered alteration in some form.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:flex lg:flex-row lg:justify-between lg:gap-x-8">
    {cards.map((card, index) => (
      <Card key={index} {...card} />
    ))}
  </div>
</div>


    </section>
  );
};

const Card = ({ imageSrc, title, description }) => {
  return (
    <div className="group relative w-full bg-gray-50 cursor-pointer rounded-2xl p-6 transition-all duration-500 hover:bg-[#6aa4e0] min-h-[200px] sm:min-h-[220px]">
      <div className="bg-white rounded-full flex justify-center mx-auto items-center mb-4 w-12 h-12 sm:w-14 sm:h-14">
        <Image src={imageSrc} alt={title} className="w-6 h-6 sm:w-8 sm:h-8" width={100} height={100}/>
      </div>
      <h4 className="text-lg sm:text-xl text-center font-semibold text-[#6aa4e0] mb-2 sm:mb-3 capitalize transition-all duration-500 group-hover:text-white leading-tight">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-center font-normal text-gray-500 transition-all duration-500 leading-relaxed group-hover:text-white">
        {description}
      </p>
    </div>
  );
};


export default Service;
