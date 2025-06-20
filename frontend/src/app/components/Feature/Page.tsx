'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FeatureImage from './FeatureImage';

interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  isNew?: boolean;
}

interface WomenServiceItem {
  id: string;
  title: string;
  img: string;
}

const ServiceSelection: React.FC = () => {
  const router = useRouter();

  const services: ServiceItem[] = [
    {
      id: 'womens-salon',
      title: "Women's Salon & Spa",
      icon: '/Assets/female-svgrepo-com.svg',
    },
    {
      id: 'mens-salon',
      title: "Men's Salon & Massage",
      icon: '/Assets/men-in-suits-to-guide-svgrepo-com.svg',
    },
    {
      id: 'appliance-repair',
      title: 'AC & Appliance Repair',
      icon: '/Assets/air-conditioner-air-conditioning-svgrepo-com.svg',
      isNew: true,
    },
    {
      id: 'electrician',
      title: 'Electrician',
      icon: '/Assets/plumber-svgrepo-com.svg',
    },
    {
      id: 'plumber',
      title: 'Plumber',
      icon: '/Assets/plumber-svgrepo-com.svg',
    },
    {
      id: 'carpenter',
      title: 'Carpenter',
      icon: '/Assets/painting-brush-svgrepo-com.svg',
    },
  ];

  const womenServices: WomenServiceItem[] = [
    {
      id: 'waxing',
      title: 'Waxing',
      img: '/Assets/WomenSaloon/woman (2).png',
    },
    {
      id: 'threading',
      title: 'Threading & face waxing',
      img: '/Assets/WomenSaloon/woman (1).png',
    },
    {
      id: 'cleanup',
      title: 'Cleanup',
      img: '/Assets/WomenSaloon/businesswoman (1).png',
    },
    {
      id: 'manicure',
      title: 'Manicure',
      img: '/Assets/WomenSaloon/woman.png',
    },
    {
      id: 'hair-care',
      title: 'Hair care',
      img: '/Assets/WomenSaloon/businesswoman.png',
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    router.push(`/booking/services?category=${serviceId}`);
  };

  return (
    <>
      <div className="w-full flex flex-col-reverse lg:flex-row items-stretch lg:items-center justify-center pt-36 pb-10 px-2 sm:px-4 gap-8">
        {/* Left: Feature selection */}
        <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto p-2 sm:p-6 bg-white rounded-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">From Booking to Service in Under 10 Minutes</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service.id)}
                  className="relative flex flex-col items-center p-2 sm:p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-[#fdc700] transition-colors duration-200 border border-black min-h-[100px] sm:min-h-[120px]"
                >
                  {service.isNew && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center bg-yellow-400 text-xs font-bold text-white shadow">NEW</div>
                  )}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-sm">
                    <Image src={service.icon} alt={service.title + ' Icon'} width={48} height={48} />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 text-center leading-tight font-medium">
                    {service.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: Image */}
        <FeatureImage />
      </div>
      {/* Women's Salon Section */}
      <div className="w-full max-w-4xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Salon for Women</h2>
          <button
            onClick={() => handleServiceClick('womens-salon')}
            className="text-purple-600 font-semibold hover:underline"
          >
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {womenServices.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center justify-start gap-y-3 text-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-20 h-20 p-4 flex items-center justify-center bg-gray-50 rounded-full">
                <Image
                  src={service.img}
                  alt={service.title}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-700 leading-tight h-10 flex items-center">
                {service.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServiceSelection;


