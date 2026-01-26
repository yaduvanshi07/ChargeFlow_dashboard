"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AllBookingCancelledDetails from "@/components/bookings/cancelled/AllBookingCancelledDetails";

export default function AllBookingCancelledDetailsPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto" style={{ padding: "24px 16px" }}>
          <AllBookingCancelledDetails />
        </main>

        <Footer />
      </div>
    </>
  );
}


