"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import "./common.css";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          setIsScrolled(scrollPosition > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, [isMounted]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav 
      className={`sticky top-0 z-50 navbar-container ${isScrolled ? 'navbar-scrolled' : ''}`}
    >
      <div 
        className="w-full h-full mx-auto"
        style={{ maxWidth: '1440px' }}
      >
        <div className="flex items-center justify-between h-full flex-wrap gap-2">
          {/* Logo and Brand */}
          <div className="flex flex-col items-start">
            <div className="navbar-logo relative flex-shrink-0">
              <Link href="/dashboard" aria-label="Dashboard">
                <Image
                  src="/chargeflow-logo.png"
                  alt="ChargeFlow Logo"
                  fill
                  sizes="(max-width: 768px) 120px, 150px"
                  className="object-contain"
                  priority
                />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-3 lg:gap-6">
            <Link
              href="/"
              className="text-base lg:text-lg text-black hover:text-gray-700 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-base lg:text-lg text-black hover:text-gray-700 transition-colors"
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-base lg:text-lg text-black hover:text-gray-700 transition-colors"
            >
              Our Services
            </Link>
            <Link
              href="/ev-owners"
              className="text-base lg:text-lg text-black hover:text-gray-700 transition-colors"
            >
              For EV Owners
            </Link>
            <Link
              href="/hosts"
              className="text-base lg:text-lg text-black hover:text-gray-700 transition-colors"
            >
              For Hosts
            </Link>
            <Link
              href="/support"
              className="text-base lg:text-lg text-black hover:text-gray-700 transition-colors"
            >
              Support
            </Link>
            <Link
              href="/contact"
              className="text-base lg:text-lg text-black hover:text-gray-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {isMounted ? (
              <>
                {/* Dark/Light Mode Toggle */}
                <button 
                  onClick={toggleDarkMode}
                  className="flex items-center justify-center hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '90px',
                    borderWidth: '1px',
                    border: '1px solid #B9B9B9',
                    opacity: 1,
                    backgroundColor: 'white',
                    boxShadow: '0px 0px 7.4px 0px rgba(0, 0, 0, 0.34)',
                  }}
                  aria-label={isDarkMode ? "Light mode" : "Dark mode"}
                  data-property="dark mood"
                >
                  {isDarkMode ? (
                    <Moon 
                      style={{ 
                        width: '19.678909301757812px',
                        height: '19.678909301757812px',
                        color: 'rgba(47, 233, 0, 1)',
                        opacity: 1
                      }} 
                    />
                  ) : (
                    <Sun 
                      style={{ 
                        width: '19.678909301757812px',
                        height: '19.678909301757812px',
                        color: 'rgba(47, 233, 0, 1)',
                        opacity: 1
                      }}
                    />
                  )}
                </button>

                {/* Login Button */}
                <Link
                  href="/login"
                  className="navbar-login-btn"
                >
                  Login
                </Link>

                {/* Sign Up Button */}
                <Link
                  href="/signup"
                  className="navbar-signup-btn"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              // SSR placeholder: Render invisible skeleton to prevent hydration mismatch
              // This maintains layout and prevents browser extensions from injecting content
              <>
                <div style={{ width: '44px', height: '44px', visibility: 'hidden' }} aria-hidden="true" />
                <div style={{ width: '80px', height: '40px', visibility: 'hidden' }} aria-hidden="true" />
                <div style={{ width: '90px', height: '40px', visibility: 'hidden' }} aria-hidden="true" />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

