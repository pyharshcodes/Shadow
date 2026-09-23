import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { UserCheck, Shield } from 'lucide-react';

export const revalidate = 0;

export default async function TrainersPage() {
  const [settings, trainers] = await Promise.all([
    prisma.businessSettings.findUnique({ where: { id: 1 } }),
    prisma.trainer.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <>
      <Navbar gymName={settings?.gymName} freeTrialEnabled={settings?.freeTrialEnabled} />

      <main className="flex-1 pt-32 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-3">
              COACHING EXCELLENCE
            </span>
            <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase text-white leading-none">
              {trainers.length === 1 ? 'OUR HEAD COACH & MENTOR' : 'OUR CERTIFIED COACHES'}
            </h1>
            <p className="mt-4 text-zinc-400 text-lg font-sans">
              Experienced coaching dedicated to biomechanical accuracy, individualized programming, and consistent performance metrics.
            </p>
          </div>

          {trainers.length === 0 ? (
            <div className="max-w-xl mx-auto p-12 rounded-2xl bg-zinc-950 border border-dashed border-zinc-800 text-center">
              <UserCheck className="w-12 h-12 text-accent/80 mx-auto mb-4" />
              <h3 className="text-2xl font-display font-black uppercase text-white mb-2">
                COACH ROSTER PENDING CONFIGURATION
              </h3>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed mb-6">
                Coaching profiles and verified certifications can be added by gym staff through the admin portal.
              </p>
              <Link
                href="/contact"
                className="inline-flex px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono text-xs uppercase tracking-wider hover:border-accent hover:text-accent transition-colors"
              >
                Inquire With Reception
              </Link>
            </div>
          ) : (
            <div className={trainers.length === 1 ? 'grid grid-cols-1 max-w-md mx-auto gap-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
              {trainers.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                      <img
                        src={
                          t.photoUrl ||
                          'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={t.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded bg-black/70 backdrop-blur-md border border-zinc-700/60 text-[11px] font-mono tracking-wider text-accent font-bold uppercase">
                        {t.role}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-display font-black uppercase text-white tracking-wide mb-1 group-hover:text-accent transition-colors">
                        {t.name}
                      </h3>
                      {t.specializations && (
                        <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
                          {t.specializations}
                        </p>
                      )}
                      {t.bio && (
                        <p className="text-sm text-zinc-400 font-sans leading-relaxed line-clamp-3 mb-4">
                          {t.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/trainers/${t.slug}`}
                      className="w-full py-3 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-wider text-center block transition-colors hover:text-accent"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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
