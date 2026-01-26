"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AllBookingMissedDetails from "@/components/bookings/missed/AllBookingMissedDetails";

export default function AllBookingMissedDetailsPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto" style={{ padding: "24px 16px" }}>
          <AllBookingMissedDetails />
        </main>

        <Footer />
      </div>
    </>
  );
}

