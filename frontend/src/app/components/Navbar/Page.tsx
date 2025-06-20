"use client";
import { IconMapPin, IconChevronDown, IconSearch, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useState } from "react";
import Link from 'next/link';

export function NavbarDemo() {
  const pathname = usePathname();
  if (pathname.startsWith('/worker')) {
    return null;
  }

  const baseNavItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "#features" },
    { name: "Worker", link: "/worker" },
  ];

  const navItems = baseNavItems;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center h-16 px-2 md:px-4">
        {/* Logo */}
        <div className="flex-shrink-0 font-bold text-lg mr-2 md:mr-6">Go-Fix-O</div>
        {/* Location Selector (hidden on mobile) */}
        <div className="hidden lg:flex items-center space-x-2 bg-white border rounded-xl px-4 py-2 min-w-[220px] max-w-[320px] mr-4">
          <IconMapPin size={20} className="text-gray-500" />
          <span className="truncate text-gray-700 text-sm">Old Ballygunge Road, ...</span>
          <IconChevronDown size={18} className="text-gray-400 ml-1" />
        </div>
        {/* Search Bar (full width on mobile) */}
        <div className="flex-1 mx-2">
          <div className="flex items-center bg-white border rounded-xl px-3 py-2 w-full">
            <IconSearch size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="w-full outline-none bg-transparent text-gray-700 text-sm"
            />
          </div>
        </div>
        {/* Nav Links (hidden on mobile) */}
        <div className="hidden md:flex space-x-2 lg:space-x-4 ml-2">
          {navItems.map((item, idx) => (
            <Link key={idx} href={item.link} className="text-black hover:text-yellow-600 px-2 py-1 rounded-md text-sm font-medium transition-colors duration-200">
              {item.name}
            </Link>
          ))}
        </div>
        {/* Login/Logout (hidden on mobile) */}
        <div className="hidden md:flex items-center ml-2">
          <span className="px-2 py-1 rounded-md text-sm font-semibold text-black">Login/Logout</span>
        </div>
        {/* Cart and User Icons */}
        <div className="flex items-center space-x-4 ml-2">
          <div className="relative">
            <IconShoppingCart size={26} className="text-black" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">1</span>
          </div>
          <IconUser size={26} className="text-black" />
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center ml-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-yellow-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white w-full shadow-md absolute top-16 left-0 z-50">
          <div className="flex flex-col space-y-1 px-4 py-2">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="text-black hover:text-yellow-600 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <span className="px-3 py-2 rounded-md text-sm font-semibold text-black mt-2">Login/Logout</span>
          </div>
        </div>
      )}
    </nav>
  );
}
