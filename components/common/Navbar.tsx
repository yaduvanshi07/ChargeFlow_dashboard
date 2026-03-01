"use client";

import { Moon, Sun, MoreVertical } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import "./common.css";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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
              href="/contact"
              className="text-base lg:text-lg text-black hover:text-gray-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button - Only visible on mobile */}
          <div className="md:hidden mobile-menu-container relative">
            <button
              onClick={toggleMobileMenu}
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
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
            >
              <MoreVertical
                style={{
                  width: '19.678909301757812px',
                  height: '19.678909301757812px',
                  color: 'rgba(0, 0, 0, 0.7)',
                  opacity: 1
                }}
              />
            </button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="mobile-menu-dropdown absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-base text-black hover:bg-gray-50 transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-base text-black hover:bg-gray-50 transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    href="/services"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-base text-black hover:bg-gray-50 transition-colors"
                  >
                    Our Services
                  </Link>
                  <Link
                    href="/contact"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-base text-black hover:bg-gray-50 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Actions - Hidden on mobile */}
          <div className="hidden md:flex navbar-actions">
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

                {/* User Profile Avatar */}
                <NavbarProfileAvatar />
              </>
            ) : (
              // SSR placeholder: Render invisible skeleton to prevent hydration mismatch
              // This maintains layout and prevents browser extensions from injecting content
              <>
                <div style={{ width: '44px', height: '44px', visibility: 'hidden' }} aria-hidden="true" />
                <div style={{ width: '44px', height: '44px', visibility: 'hidden' }} aria-hidden="true" />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ─── Navbar Profile Avatar (read-only) ─────────────────── */
function NavbarProfileAvatar() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("profile-image");
      setProfileImage(saved ?? null);
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  return (
    <Link
      href="/dashboard/personal-information"
      aria-label="View profile"
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#B9B9B9',
        backgroundColor: 'white',
        boxShadow: '0px 0px 7.4px 0px rgba(0, 0, 0, 0.34)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        textDecoration: 'none',
      }}
      suppressHydrationWarning
    >
      {profileImage ? (
        <img
          src={profileImage}
          alt="User profile"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8E8E93"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: '22px', height: '22px' }}
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )}
    </Link>
  );
}


