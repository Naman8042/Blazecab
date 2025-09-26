"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { FaUser } from "react-icons/fa";


export default function TestimonialCarousel() {
  const testimonials = [
    {
      id: 1,
      name: "Naman Sharma",
      role: "",
      image:
        "https://images.unsplash.com/photo-1544725176-7c40e5a2c9f2?q=80&w=100&auto=format&fit=crop",
      review:
        "Blazecab has been my go-to for daily commutes. The rides are always on time and the drivers are super professional. I’ve stopped worrying about being late for work.",
      rating: 3.5,
    },
    {
      id: 2,
      name: "Prabhakar",
      role: "",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
      review:
        "The app is simple and reliable. I book a ride in seconds, and the pricing is very transparent. I also love how smooth the payment process is!",
      rating: 4,
    },
    {
      id: 3,
      name: "Shaurya Sharma",
      role: "",
      image:
        "https://images.unsplash.com/photo-1603415526960-f7e0328dd352?q=80&w=100&auto=format&fit=crop",
      review:
        "I started using Blazecab for my weekend trips and I’ve been impressed with the comfort and cleanliness. Definitely better than my previous ride apps.",
      rating: 4,
    },
    {
      id: 4,
      name: "Samyak Jain",
      role: "",
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=100&auto=format&fit=crop",
      review:
        "The best thing about Blazecab is consistency. No random cancellations, no long wait times. It just works every single time I book a ride.",
      rating: 5,
    },
    {
      id: 5,
      name: "Vimarsh Gurka",
      role: "",
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=100&auto=format&fit=crop",
      review:
        "Blazecab is a lifesaver when I’m rushing to the airport. The scheduling feature is spot on—I can pre-book and never stress about catching a flight again.",
      rating: 3,
    },
  ];

  return (
    <div className="text-center px-4 py-12 ">
      <span className="bg-[#FFB300] text-white px-3 py-1 rounded-full text-xs font-semibold">
        Testimonials
      </span>
      <h1 className="text-2xl font-bold text-[#6aa4e0] py-4 md:text-4xl">
        What Our Riders Say
      </h1>
      <p className="text-sm font-normal text-gray-500 max-w-2xl mx-auto md:text-lg">
        Discover why thousands choose Blazecab for reliable and comfortable rides
      </p>

      <div className="max-w-7xl mx-auto mt-16">
        <Swiper
          spaceBetween={20}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          breakpoints={{
            0: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          className="!pb-12"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="flex flex-col h-[300px] justify-between border border-gray-200 p-6 rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 ">
                {/* Quote */}
                <svg
                  width="44"
                  height="40"
                  viewBox="0 0 44 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203"
                    fill="#6aa4e0"
                  />
                </svg>

                {/* Rating */}
              
                <div className="flex items-center mt-4 gap-1 justify-center">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg
                      key={i}
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.524.464a.5.5 0 0 1 .952 0l1.432 4.41a.5.5 0 0 0 .476.345h4.637a.5.5 0 0 1 .294.904L11.563 8.85a.5.5 0 0 0-.181.559l1.433 4.41a.5.5 0 0 1-.77.559L8.294 11.65a.5.5 0 0 0-.588 0l-3.751 2.726a.5.5 0 0 1-.77-.56l1.433-4.41a.5.5 0 0 0-.181-.558L.685 6.123A.5.5 0 0 1 .98 5.22h4.637a.5.5 0 0 0 .476-.346z"
                        fill="#FFB300"
                      />
                    </svg>
                  ))}
                </div>

                {/* Review */}
                <p className="text-gray-600 mt-4 flex-1">{t.review}</p>

                
                {/* User Info */}
                <div className="flex items-center mt-6 gap-3">
                  <FaUser className="w-10 h-10 text-gray-500 border-2 rounded-full" />
                  <div className="text-left">
                    <h2 className="text-gray-900 font-medium">{t.name}</h2>
                    <p className="text-gray-500 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
