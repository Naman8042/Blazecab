"use client";  

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Usman Khan",
    role: "CO Founder",
    image: "/images/usman.jpg",
    rating: 5,
    quote:
      "But don&apos;t just take our word for it&mdash;hear what our satisfied clients have to say. From Fortune 500 companies to small...",
  },
  {
    id: 2,
    name: "Amir Jamil",
    role: "Software Engineer",
    image: "/images/amir.jpg",
    rating: 5,
    quote:
      "But don&apos;t just take our word for it&mdash;hear what our satisfied clients have to say. From Fortune 500 companies to small...",
  },
  {
    id: 3,
    name: "Naman",
    role: "Software Engineer",
    image: "/images/amir.jpg",
    rating: 5,
    quote:
      "But don&apos;t just take our word for it&mdash;hear what our satisfied clients have to say. From Fortune 500 companies to small...",
  },
  {
    id: 4,
    name: "Shaurya",
    role: "Software Engineer",
    image: "/images/amir.jpg",
    rating: 5,
    quote:
      "But don&apos;t just take our word for it&mdash;hear what our satisfied clients have to say. From Fortune 500 companies to small...",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="bg-[#FFB300] text-white px-3 py-1 rounded-full text-xs font-semibold">
            Testimonials
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#3D85C6] mt-2">
            Real Stories, Real Results
          </h2>
        </motion.div>

        {/* Testimonial Slider */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Swiper
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            spaceBetween={15}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-lg text-center">
                  {/* Rating Stars */}
                  <div className="flex space-x-1 text-[#FFB300] mb-3 justify-center">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-gray-700 text-sm italic">
                    "{testimonial.quote}"
                  </p>

                  {/* User Info */}
                  <div className="mt-4 flex flex-col items-center">
                    <Image
                      src={testimonial.image}
                      width={60}
                      height={60}
                      alt={testimonial.name}
                      className="rounded-full border border-[#3D85C6]"
                    />
                    <h3 className="font-semibold text-[#3D85C6] mt-2 text-sm">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;
