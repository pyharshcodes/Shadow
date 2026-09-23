import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Award, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';

export const revalidate = 0;

export default async function TrainerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [settings, trainer] = await Promise.all([
    prisma.businessSettings.findUnique({ where: { id: 1 } }),
    prisma.trainer.findFirst({
      where: { slug, isPublished: true },
      include: { programs: true },
    }),
  ]);

  if (!trainer) {
    notFound();
  }

  const whatsappMessage = `Hi SHADOW FITNESS, I would like to consult or train with Coach ${trainer.name}.`;
  const whatsappUrl = generateWhatsAppUrl(settings?.whatsappNumber, whatsappMessage);

  return (
    <>
      <Navbar gymName={settings?.gymName} freeTrialEnabled={settings?.freeTrialEnabled} />

      <main className="flex-1 pt-28 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/trainers"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all coaches</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Photo & Bio */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] bg-zinc-950 border border-zinc-800 shadow-2xl relative">
                <img
                  src={
                    trainer.photoUrl ||
                    'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-xs font-mono px-3 py-1 rounded bg-accent/20 border border-accent/40 text-accent font-bold uppercase mb-2 inline-block">
                    {trainer.role}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-display font-black uppercase text-white tracking-wide">
                    {trainer.name}
                  </h1>
                </div>
              </div>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl bg-[#25D366] text-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)]"
                >
                  <MessageSquare className="w-4 h-4 fill-black" />
                  <span>CONSULT WITH COACH {trainer.name.split(' ')[0]}</span>
                </a>
              )}
            </div>

            {/* Right Details */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-2">
                  BACKGROUND & METHODOLOGY
                </h2>
                <h3 className="text-3xl font-display font-black uppercase text-white tracking-wide mb-4">
                  COACHING PHILOSOPHY
                </h3>
                <p className="text-zinc-300 font-sans text-base sm:text-lg leading-relaxed">
                  {trainer.bio || 'Dedicated to helping lifters refine technique, break plateaus, and maintain joint longevity through intelligent training.'}
                </p>
              </div>

              {trainer.specializations && (
                <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-2">
                  <h4 className="text-sm font-mono text-zinc-400 uppercase tracking-wider font-bold">
                    PRIMARY SPECIALIZATIONS
                  </h4>
                  <p className="text-lg font-display uppercase tracking-wide text-white">
                    {trainer.specializations}
                  </p>
                </div>
              )}

              {trainer.certifications && (
                <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-2">
                  <h4 className="text-sm font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" />
                    <span>VERIFIED CERTIFICATIONS & ACCREDITATIONS</span>
                  </h4>
                  <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                    {trainer.certifications}
                  </p>
                </div>
              )}

              {trainer.programs && trainer.programs.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <h4 className="text-xl font-display uppercase tracking-wide text-white font-bold">
                    PROGRAMS MENTORED BY {trainer.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trainer.programs.map((prog) => (
                      <Link
                        key={prog.id}
                        href={`/programs/${prog.slug}`}
                        className="p-5 rounded-xl bg-zinc-950 border border-zinc-850 hover:border-accent/60 transition-colors group block"
                      >
                        <h5 className="font-display font-bold uppercase text-white group-hover:text-accent transition-colors">
                          {prog.title}
                        </h5>
                        <p className="text-xs text-zinc-500 font-sans line-clamp-2 mt-1">
                          {prog.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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
