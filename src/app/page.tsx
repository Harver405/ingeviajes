import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Timeline from "@/components/sections/Timeline";
import Experiences from "@/components/sections/Experiences";
import VideoSection from "@/components/sections/VideoSection";
import UpcomingTrips from "@/components/sections/UpcomingTrips";
import Promo from "@/components/sections/Promo";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Timeline />
        <Experiences />
        <UpcomingTrips />
        <VideoSection />
        <Contact />
      </main>
      <Footer />
      <Promo />
    </>
  );
}