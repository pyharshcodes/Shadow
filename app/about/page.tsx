import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ShieldCheck, Target, Award, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function AboutPage() {
  const settings = await prisma.businessSettings.findUnique({ where: { id: 1 } });

  return (
    <>
      <Navbar gymName={settings?.gymName} freeTrialEnabled={settings?.freeTrialEnabled} />

      <main className="flex-1 pt-32 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-3">
              THE SHADOW ETHOS
            </span>
            <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase text-white leading-none">
              BUILT ON UNCOMPROMISING DISCIPLINE
            </h1>
            <p className="mt-6 text-lg text-zinc-300 font-sans leading-relaxed">
              {settings?.aboutText ||
                'SHADOW FITNESS was founded to provide a sanctuary from fitness gimmicks. We believe progress isn’t granted by wishful thinking—it is forged one disciplined session at a time.'}
            </p>
          </div>

          {/* Visual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-black uppercase text-white">PURPOSEFUL PROGRESSION</h3>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Every lift, every rep, and every batch schedule is structured with intent. We don’t waste energy on aimless workouts.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-black uppercase text-white">REFINED ATMOSPHERE</h3>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Quiet intensity, mutual respect, and zero overcrowding. When you step through our doors, your attention is purely on the work.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-black uppercase text-white">AUTHENTIC STANDARDS</h3>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                No false promises or 30-day shortcuts. We cultivate genuine strength, joint longevity, and habits that endure.
              </p>
            </div>
          </div>

          {/* Editorial Banner */}
          <div className="rounded-3xl overflow-hidden relative border border-zinc-800 bg-zinc-900 aspect-[21/9] flex items-center justify-center text-center p-8">
            <img
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1800&q=80"
              alt="Facility Interior"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.25]"
            />
            <div className="relative z-10 max-w-2xl space-y-6">
              <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white leading-tight">
                READY TO TRAIN WITH MEANING?
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/free-trial"
                  className="px-8 py-3.5 bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider rounded-lg transition-all"
                >
                  CLAIM FREE TRIAL
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3.5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs uppercase tracking-wider rounded-lg transition-all"
                >
                  VISIT FACILITY
                </Link>
              </div>
            </div>
          </div>
        </div>
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
      />
    </>
  );
}
