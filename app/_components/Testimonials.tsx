"use client";
import { useState, useEffect } from "react";

export default function Example() {
  const testimonials = [
    {
      id: 1,
      name: "Donald Jackman",
      role: "SWE 1 @ Amazon",
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100",
      review:
        "I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
      rating: 5,
    },
    {
      id: 2,
      name: "Richard Nelson",
      role: "SWE 2 @ Amazon",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
      review:
        "Imagify helps me save so much time with content creation. The simplicity is unmatched!",
      rating: 5,
    },
    {
      id: 3,
      name: "James Washington",
      role: "SWE 2 @ Google",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop",
      review:
        "As a designer, having an intuitive tool like Imagify allows me to focus on creativity instead of wasting time on repetitive tasks.",
      rating: 5,
    },
    {
      id: 4,
      name: "Sophia Carter",
      role: "ML Engineer @ OpenAI",
      image:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=100&auto=format&fit=crop",
      review:
        "I was amazed by how easily I could automate my social media workflows. Game changer for my productivity!",
      rating: 4,
    },
    {
      id: 5,
      name: "Michael Chen",
      role: "Frontend Dev @ Meta",
      image:
        "https://images.unsplash.com/photo-1603415526960-f7e0328dd352?q=80&w=100&auto=format&fit=crop",
      review:
        "The performance boost I got from Imagify tools is insane. Highly recommend it for developers!",
      rating: 5,
    },
  ];

  const [index, setIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Detect screen size and adjust items per slide
  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1); // Mobile → 1 card
      } else {
        setItemsPerSlide(3); // Tablet & desktop → 3 cards
      }
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  // Auto-rotate based on itemsPerSlide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + itemsPerSlide) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [itemsPerSlide, testimonials.length]);

  // Slice current set of testimonials
  const visible = testimonials.slice(index, index + itemsPerSlide);
  const displayed =
    visible.length < itemsPerSlide
      ? [...visible, ...testimonials.slice(0, itemsPerSlide - visible.length)]
      : visible;

  return (
    <div className="text-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
        What Our Students Say
      </h1>
      <p className="text-sm md:text-base text-gray-500 mt-4">
        Join thousands of successful students who transformed their careers with
        us
      </p>

      <div className="flex flex-wrap justify-center gap-5 mt-16 text-left transition-all duration-700 max-w-7xl mx-auto">
        {displayed.map((t) => (
          <div
            key={t.id}
            className="w-full sm:w-[48%] lg:w-[30%] h-[275px] flex flex-col justify-between border border-gray-200 p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Top Content */}
            <div>
              <svg
                width="44"
                height="40"
                viewBox="0 0 44 40"
                fill="none"
                color="#6aa4e0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203"
                  fill="#2563EB"
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
            
              <div>
                <h2 className="text-lg text-gray-900 font-medium">{t.name}</h2>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
