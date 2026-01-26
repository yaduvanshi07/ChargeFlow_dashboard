import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { MapPin, Mail, Phone } from "lucide-react";
import "./common.css";

export default function Footer() {
  return (
    <footer className="bg-[#F0FFF0] w-full">
      <div className="max-w-7xl mx-auto footer-container">
        {/* Upper Content Section */}
        <div className="footer-upper">
          {/* Company Information Column */}
          <div className="footer-company">
            <div className="mb-4 flex justify-center footer-logo-container">
              <Image
                src="/chargeflow-logo.png"
                alt="ChargeFlow Logo"
                width={200}
                height={200}
                sizes="(max-width: 768px) 150px, 200px"
                className="footer-logo object-contain"
              />
            </div>
            
            <p className="footer-company-title font-bold text-black" style={{ fontFamily: 'sans-serif' }}>
              Powering India&apos;s EV Revolution
            </p>
            <p className="footer-company-text text-black leading-relaxed" style={{ fontFamily: 'sans-serif', color: 'rgba(124, 124, 124, 1)' }}>
              ChargeFlow connects EV owners with charging station hosts across India. Find charging points, book slots, and power your journey seamlessly.
            </p>
          </div>

          {/* Right Side: Quick Links, Our Services, and Contact Info grouped together */}
          <div className="footer-links-section">
            {/* Quick Links Column */}
            <div className="footer-column">
              <h3 className="footer-column-title font-bold text-black text-left" style={{ fontFamily: 'sans-serif' }}>
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="footer-link transition-colors"
                    style={{ 
                      fontFamily: 'sans-serif', 
                      color: 'rgba(124, 124, 124, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(124, 124, 124, 1)'}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="footer-link transition-colors"
                    style={{ 
                      fontFamily: 'sans-serif', 
                      color: 'rgba(124, 124, 124, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(124, 124, 124, 1)'}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/find-chargers"
                    className="footer-link transition-colors"
                    style={{ 
                      fontFamily: 'sans-serif', 
                      color: 'rgba(124, 124, 124, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(124, 124, 124, 1)'}
                  >
                    Find Chargers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/become-host"
                    className="footer-link transition-colors"
                    style={{ 
                      fontFamily: 'sans-serif', 
                      color: 'rgba(124, 124, 124, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(124, 124, 124, 1)'}
                  >
                    Become A Host
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="footer-link transition-colors"
                    style={{ 
                      fontFamily: 'sans-serif', 
                      color: 'rgba(124, 124, 124, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(124, 124, 124, 1)'}
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="footer-link transition-colors"
                    style={{ 
                      fontFamily: 'sans-serif', 
                      color: 'rgba(124, 124, 124, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(124, 124, 124, 1)'}
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Our Services Column */}
            <div className="footer-column">
              <h3 className="footer-column-title font-bold text-black text-left" style={{ fontFamily: 'sans-serif' }}>
                our Services
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/services/ev-charging"
                    className="footer-link transition-colors"
                    style={{ 
                      fontFamily: 'sans-serif', 
                      color: 'rgba(124, 124, 124, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(124, 124, 124, 1)'}
                  >
                    EV Charging
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/host-registration"
                    className="footer-link transition-colors"
                    style={{ 
                      fontFamily: 'sans-serif', 
                      color: 'rgba(124, 124, 124, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(124, 124, 124, 1)'}
                  >
                    Host Registration
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/customer-support"
                    className="footer-link transition-colors"
                    style={{ 
                      fontFamily: 'sans-serif', 
                      color: 'rgba(124, 124, 124, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(124, 124, 124, 1)'}
                  >
                    Customer Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="footer-link transition-colors"
                    style={{ 
                      fontFamily: 'sans-serif', 
                      color: 'rgba(124, 124, 124, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(124, 124, 124, 1)'}
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing-plans"
                    className="footer-link transition-colors"
                    style={{ 
                      fontFamily: 'sans-serif', 
                      color: 'rgba(124, 124, 124, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(124, 124, 124, 1)'}
                  >
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mobile-app"
                    className="footer-link transition-colors"
                    style={{ 
                      fontFamily: 'sans-serif', 
                      color: 'rgba(124, 124, 124, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(124, 124, 124, 1)'}
                  >
                    Mobile App
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info Column */}
            <div className="footer-column">
              <h3 className="footer-column-title font-bold text-black text-left" style={{ fontFamily: 'sans-serif' }}>
                Contact Info
              </h3>
              <ul className="space-y-3 mb-4" style={{ fontFamily: 'sans-serif' }}>
                <li className="flex items-center gap-2">
                  <MapPin className="footer-social-icon text-[#34C759]" />
                  <span className="footer-contact-item" style={{ color: 'rgba(124, 124, 124, 1)' }}>Sector 18, Noida, India</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="footer-social-icon text-[#34C759]" />
                  <a
                    href="mailto:Support@Chargeflow.Com"
                    className="footer-contact-item hover:text-green-600 transition-colors"
                    style={{ color: 'rgba(124, 124, 124, 1)' }}
                  >
                    Support@Chargeflow.Com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="footer-social-icon text-[#34C759]" />
                  <a
                    href="tel:+917887209295"
                    className="footer-contact-item hover:text-green-600 transition-colors"
                    style={{ color: 'rgba(124, 124, 124, 1)' }}
                  >
                    +91-7887209295
                  </a>
                </li>
              </ul>
              {/* Social Media Icons */}
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="#"
                  className="footer-social-icon"
                  aria-label="Instagram"
                >
                  <Icon icon="skill-icons:instagram" className="footer-social-icon" />
                </a>
                <a
                  href="#"
                  className="footer-social-icon"
                  aria-label="Facebook"
                >
                  <Icon icon="logos:facebook" className="footer-social-icon" />
                </a>
                <a
                  href="#"
                  className="footer-social-icon"
                  aria-label="Twitter"
                >
                  <Icon icon="logos:twitter" className="footer-social-icon" />
                </a>
                <a
                  href="#"
                  className="footer-social-icon"
                  aria-label="LinkedIn"
                >
                  <Icon icon="devicon:linkedin" className="footer-social-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Copyright and Policy Section */}
        <div className="footer-lower">
          <p className="footer-copyright text-black" style={{ fontFamily: 'sans-serif' }}>
            © 2025 ChargeFlow All Rights Reserved.
          </p>
          <div className="footer-policies">
            <Link
              href="/terms"
              className="footer-policy-link text-black hover:text-green-600 transition-colors"
              style={{ fontFamily: 'sans-serif' }}
            >
              Terms Of Service
            </Link>
            <Link
              href="/privacy"
              className="footer-policy-link text-black hover:text-green-600 transition-colors"
              style={{ fontFamily: 'sans-serif' }}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

