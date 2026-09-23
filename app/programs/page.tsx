import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function ProgramsPage() {
  const [settings, programs] = await Promise.all([
    prisma.businessSettings.findUnique({ where: { id: 1 } }),
    prisma.program.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      include: { trainer: true },
    }),
  ]);

  return (
    <>
      <Navbar gymName={settings?.gymName} freeTrialEnabled={settings?.freeTrialEnabled} />

      <main className="flex-1 pt-32 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-3">
              CURATED DISCIPLINES
            </span>
            <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase text-white leading-none">
              TRAINING PROGRAMS & PATHWAYS
            </h1>
            <p className="mt-4 text-zinc-400 text-lg font-sans">
              Every training pathway is grounded in progressive overload, mechanical efficiency, and consistent athletic progression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="group rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                    <img
                      src={
                        prog.imageUrl ||
                        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={prog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded bg-black/70 backdrop-blur-md border border-zinc-700/60 text-[11px] font-mono tracking-wider text-accent font-bold uppercase">
                      {prog.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-display font-black uppercase text-white tracking-wide group-hover:text-accent transition-colors mb-3">
                      {prog.title}
                    </h3>
                    <p className="text-sm text-zinc-400 font-sans leading-relaxed line-clamp-3 mb-6">
                      {prog.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-400 border-t border-zinc-850 pt-4">
                      {prog.duration && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-accent" />
                          <span>{prog.duration}</span>
                        </div>
                      )}
                      {prog.schedule && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          <span>{prog.schedule}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/programs/${prog.slug}`}
                    className="w-full py-3 px-4 rounded-lg bg-zinc-900 hover:bg-accent hover:text-black text-white font-display font-black text-xs uppercase tracking-wider text-center block transition-all"
                  >
                    EXPLORE PROGRAM
                  </Link>
                </div>
              </div>
            ))}
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
