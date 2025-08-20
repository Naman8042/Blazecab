"use client";
import { useState, useEffect } from "react";

export default function Example() {
  const testimonials = [
    {
      id: 1,
      name: "Donald Jackman",
      role: "SWE 1 @ Amazon",
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100",
      review: "I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
      rating: 5,
    },
    {
      id: 2,
      name: "Richard Nelson",
      role: "SWE 2 @ Amazon",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
      review: "Imagify helps me save so much time with content creation. The simplicity is unmatched!",
      rating: 5,
    },
    {
      id: 3,
      name: "James Washington",
      role: "SWE 2 @ Google",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop",
      review: "As a designer, having an intuitive tool like Imagify allows me to focus on creativity instead of wasting time on repetitive tasks.",
      rating: 5,
    },
    {
      id: 4,
      name: "Sophia Carter",
      role: "ML Engineer @ OpenAI",
      image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=100&auto=format&fit=crop",
      review: "I was amazed by how easily I could automate my social media workflows. Game changer for my productivity!",
      rating: 4,
    },
    {
      id: 5,
      name: "Michael Chen",
      role: "Frontend Dev @ Meta",
      image: "https://images.unsplash.com/photo-1603415526960-f7e0328dd352?q=80&w=100&auto=format&fit=crop",
      review: "The performance boost I got from Imagify tools is insane. Highly recommend it for developers!",
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Detect screen size and adjust items per slide
  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev >= testimonials.length - itemsPerSlide ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [itemsPerSlide, testimonials.length]);

  const goToSlide = (index:number) => {
    setCurrentIndex(index);
  };

  // Get visible testimonials
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < itemsPerSlide; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();
  const maxSlides = testimonials.length - itemsPerSlide + 1;

  return (
    <div className="text-center px-4">
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
        {/* Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-500">
          {visibleTestimonials.map((t) => (
            <div
              key={`${t.id}-${currentIndex}`}
              className="h-[275px] flex flex-col justify-between border border-gray-200 p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Quote Icon */}
              <div>
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

                {/* Stars */}
                <div className="flex items-center mt-3 gap-1">
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
                        fill="#FF532E"
                      />
                    </svg>
                  ))}
                </div>

                <p className="text-sm mt-3 text-gray-500 line-clamp-5">
                  {t.review}
                </p>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 mt-4">
                {/* <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                /> */}
                <div className="text-left">
                  <h2 className="text-lg text-gray-900 font-medium">{t.name}</h2>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: maxSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-[#6aa4e0] scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
