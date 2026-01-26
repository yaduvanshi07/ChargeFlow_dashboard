"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AllBookingRespondedDetails from "@/components/bookings/responded/AllBookingRespondedDetails";

export default function AllBookingRespondedDetailsPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto" style={{ padding: "24px 16px" }}>
          <AllBookingRespondedDetails />
        </main>

        <Footer />
      </div>
    </>
  );
}

