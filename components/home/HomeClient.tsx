'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from './HeroSection';
import { ManifestoSection } from './ManifestoSection';
import { WhyShadowSection } from './WhyShadowSection';
import { GoalSelector } from '../ui/GoalSelector';
import { ProgramsSection, ProgramItem } from './ProgramsSection';
import { FacilityTour, FacilityItem } from '../ui/FacilityTour';
import { TrainersSection, TrainerItem } from './TrainersSection';
import { MembershipSection, MembershipItem } from './MembershipSection';
import { GallerySection, GalleryItem } from './GallerySection';
import { TrialSection } from './TrialSection';
import { LocationSection } from './LocationSection';
import { EnquiryModal } from '../ui/EnquiryModal';
import { MobileConversionBar } from '../ui/MobileConversionBar';

interface HomeClientProps {
  settings: any;
  homepage: any;
  programs: ProgramItem[];
  facilities: FacilityItem[];
  trainers: TrainerItem[];
  memberships: MembershipItem[];
  transformations?: any;
  gallery: GalleryItem[];
}

export function HomeClient({
  settings,
  homepage,
  programs,
  facilities,
  trainers,
  memberships,
  transformations,
  gallery,
}: HomeClientProps) {
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [enquiryType, setEnquiryType] = useState<'general' | 'membership' | 'program' | 'trainer'>('general');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const handleOpenPlanEnquiry = (plan: MembershipItem) => {
    setSelectedPlan(plan.name);
    setEnquiryType('membership');
    setEnquiryModalOpen(true);
  };

  const handleOpenProgramEnquiry = (prog: ProgramItem) => {
    setSelectedPlan(prog.title);
    setEnquiryType('program');
    setEnquiryModalOpen(true);
  };

  const handleGeneralEnquiry = () => {
    setSelectedPlan('');
    setEnquiryType('general');
    setEnquiryModalOpen(true);
  };

  return (
    <>
      <Navbar
        gymName={settings?.gymName}
        freeTrialEnabled={settings?.freeTrialEnabled}
        onOpenTrial={() => {
          const el = document.getElementById('free-trial');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          title={homepage?.heroTitle}
          subtitle={homepage?.heroSubtitle}
          badge={homepage?.heroBadge}
          cta1Text={homepage?.heroCta1Text}
          cta1Link={homepage?.heroCta1Link}
          cta2Text={homepage?.heroCta2Text}
          cta2Link={homepage?.heroCta2Link}
          mediaUrl={homepage?.heroMediaUrl}
          onOpenEnquiry={handleGeneralEnquiry}
        />

        {/* 2. Manifesto & Philosophy Ticker */}
        <ManifestoSection
          title={homepage?.manifestoTitle}
          text={homepage?.manifestoText}
          tickerText={homepage?.scrollTickerText}
        />

        {/* 3. Why Shadow Fitness */}
        <WhyShadowSection />

        {/* 4. Interactive Fitness Goals */}
        <section className="py-20 bg-background border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center sm:text-left">
              <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-2">
                WHAT IS YOUR OBJECTIVE?
              </span>
              <h3 className="text-3xl sm:text-4xl font-display font-black uppercase text-white tracking-wide">
                SELECT YOUR PHYSICAL TARGET
              </h3>
            </div>
            <GoalSelector onSelectGoal={(cat) => setFilterCategory(cat)} />
          </div>
        </section>

        {/* 5. Programs Showcase */}
        <ProgramsSection
          programs={programs}
          filterCategory={filterCategory}
          onSelectProgram={handleOpenProgramEnquiry}
        />

        {/* 6. Facility Experience: Step Inside Shadow */}
        <section id="facilities" className="py-24 sm:py-32 bg-background border-t border-zinc-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-3">
                ARCHITECTURAL SPACE
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tight uppercase text-white leading-none">
                STEP INSIDE SHADOW
              </h2>
              <p className="mt-4 text-zinc-400 text-base sm:text-lg font-sans">
                Every station has been purposefully laid out to maximize flow, focus, and lifting density.
              </p>
            </div>
            <FacilityTour facilities={facilities} />
          </div>
        </section>

        {/* 7. Coaches / Mentors */}
        <TrainersSection trainers={trainers} />

        {/* 8. Membership Tiers */}
        <MembershipSection
          memberships={memberships}
          onSelectPlan={handleOpenPlanEnquiry}
        />

        {/* 9. Photo Gallery */}
        <GallerySection images={gallery} />

        {/* 11. Free Trial Booking Capture */}
        <TrialSection
          freeTrialEnabled={settings?.freeTrialEnabled}
          whatsappNumber={settings?.whatsappNumber}
        />

        {/* 12. Location & Operating Hours */}
        <LocationSection
          gymName={settings?.gymName}
          address={settings?.address}
          googleMapsEmbedUrl={settings?.googleMapsEmbedUrl}
          googleMapsLink={settings?.googleMapsLink}
          phone={settings?.phone}
          whatsappNumber={settings?.whatsappNumber}
          openingHours={settings?.openingHours}
          parkingInfo={settings?.parkingInfo}
          onOpenEnquiry={handleGeneralEnquiry}
        />
      </main>

      <Footer
        gymName={settings?.gymName}
        tagline={settings?.tagline}
        phone={settings?.phone}
        whatsappNumber={settings?.whatsappNumber}
        email={settings?.email}
        address={settings?.address}
        googleMapsLink={settings?.googleMapsLink}
        openingHours={settings?.openingHours}
        instagramUrl={settings?.instagramUrl}
        youtubeUrl={settings?.youtubeUrl}
        facebookUrl={settings?.facebookUrl}
        footerText={settings?.footerText}
      />

      {/* Global Contextual Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        defaultPlan={selectedPlan}
        defaultType={enquiryType}
        whatsappNumber={settings?.whatsappNumber}
      />

      {/* Sticky Mobile Conversion Bottom Bar */}
      <MobileConversionBar
        phone={settings?.phone}
        whatsappNumber={settings?.whatsappNumber}
        onOpenEnquiry={handleGeneralEnquiry}
      />
    </>
  );
}
