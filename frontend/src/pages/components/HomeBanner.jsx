import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../../lib/api";
import "swiper/css/bundle";
import Swiper from "swiper/bundle";

export default function HomeBanner() {
  const [banners, setBanners] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const loadBanners = async () => {
      const res = await apiFetch("/public/banners.php");
      if (res?.data) {
        const activeBanners = res.data
          .filter((b) => b.is_active)
          .sort((a, b) => a.position - b.position);
        setBanners(activeBanners);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length && !swiperRef.current) {
      swiperRef.current = new Swiper(".swiper", {
        loop: banners.length > 1,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
      });
    }
  }, [banners]);

  if (!banners.length) return null;

  return (
    <div className="swiper relative rounded overflow-hidden">
      <style>
        {`
          .swiper { height: 280px; }
          @media (min-width: 640px) { .swiper { height: 400px; } }
          @media (min-width: 1024px) { .swiper { height: 520px; } }

          .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: rgba(255,255,255,0.6);
            opacity: 1;
          }
          .swiper-pagination-bullet-active {
            background: rgba(255,255,255,0.95);
          }

          .banner-text { max-width: 90%; }
          @media (min-width: 640px) { .banner-text { max-width: 70%; } }
          @media (min-width: 1024px) { .banner-text { max-width: 50%; } }
        `}
      </style>

      <div className="swiper-wrapper">
        {banners.map((b) => (
          <div className="swiper-slide" key={b.id}>
            <div className="relative w-full h-full">
              <img
                src={import.meta.env.VITE_PUBLIC_URL + b.image}
                alt={b.title}
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/40 via-black/20 to-transparent flex items-end">
                <div className="banner-text">
                  <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                    {b.title}
                  </h3>
                  {b.subtitle && (
                    <p className="text-sm sm:text-lg md:text-xl text-white drop-shadow-md mt-1">
                      {b.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="swiper-pagination"></div>
    </div>
  );
}
