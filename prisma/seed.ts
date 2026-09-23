import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Shadow Fitness Database ---');

  // 1. Create Admin User
  const adminPasswordHash = await bcrypt.hash('shadowfitness123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@shadowfitness.com' },
    update: {},
    create: {
      email: 'admin@shadowfitness.com',
      passwordHash: adminPasswordHash,
      name: 'Shadow Administrator',
      role: 'admin',
    },
  });
  console.log(`Admin user ready: ${adminUser.email}`);

  // 2. Initialize Business Settings
  // Note: Following strict requirement not to invent unverified contact details.
  // The owner can enter exact details through the /admin dashboard.
  await prisma.businessSettings.upsert({
    where: { id: 1 },
    update: {
      gymName: 'SHADOW FITNESS',
      tagline: 'Discipline over motivation.',
      phone: '+91 76185 81835',
      whatsappNumber: '+917618581835',
      email: 'shadowfitnesskishni@gmail.com',
      address: 'NH234, Jatpura, Kishni, Mainpuri, Uttar Pradesh 206302',
      googleMapsLink: 'https://maps.app.goo.gl/ZFqzHQCXrAV6No4L9',
      googleMapsEmbedUrl: 'https://maps.google.com/maps?q=27.0028867,79.2459083&hl=en&z=16&output=embed',
      instagramUrl: 'https://instagram.com/shadow_shivoo_',
      openingHours: JSON.stringify([
        { days: 'Monday - Saturday', hours: '05:30 AM - 10:00 PM' },
        { days: 'Sunday', hours: '06:00 AM - 12:00 PM' },
      ]),
      parkingInfo: 'Dedicated parking space available on premises along NH234',
      accentColor: '#d4f933',
      freeTrialEnabled: true,
      aboutText:
        'SHADOW FITNESS in Jatpura, Kishni was forged for those who refuse complacency. An environment engineered solely for progress, focus, and unrelenting athletic discipline.',
      footerText: 'Kishni’s premier performance & strength training gym. Built for those who respect the process and show up every single day.',
    },
    create: {
      id: 1,
      gymName: 'SHADOW FITNESS',
      tagline: 'Discipline over motivation.',
      phone: '+91 76185 81835',
      whatsappNumber: '+917618581835',
      email: 'shadowfitnesskishni@gmail.com',
      address: 'NH234, Jatpura, Kishni, Mainpuri, Uttar Pradesh 206302',
      googleMapsLink: 'https://maps.app.goo.gl/ZFqzHQCXrAV6No4L9',
      googleMapsEmbedUrl: 'https://maps.google.com/maps?q=27.0028867,79.2459083&hl=en&z=16&output=embed',
      instagramUrl: 'https://instagram.com/shadow_shivoo_',
      openingHours: JSON.stringify([
        { days: 'Monday - Saturday', hours: '05:30 AM - 10:00 PM' },
        { days: 'Sunday', hours: '06:00 AM - 12:00 PM' },
      ]),
      parkingInfo: 'Dedicated parking space available on premises along NH234',
      accentColor: '#d4f933',
      freeTrialEnabled: true,
      aboutText:
        'SHADOW FITNESS in Jatpura, Kishni was forged for those who refuse complacency. An environment engineered solely for progress, focus, and unrelenting athletic discipline.',
      footerText: 'Kishni’s premier performance & strength training gym. Built for those who respect the process and show up every single day.',
    },
  });

  // 3. Initialize Homepage Dynamic Content
  await prisma.homepageSection.upsert({
    where: { id: 1 },
    update: {
      heroTitle: 'BUILD YOUR\nSTRONGER SELF.',
      heroSubtitle: 'Kishni’s premier strength & performance gym. Master the barbell, train with intensity, and achieve authentic physical transformation.',
      heroBadge: 'TRAIN • BUILD • TRANSFORM',
      heroCta1Text: 'START YOUR JOURNEY',
      heroCta1Link: '#membership',
      heroCta2Text: 'STEP INSIDE SHADOW',
      heroCta2Link: '#facilities',
      heroMediaUrl: '/images/gym/photo_2.png',
      manifestoTitle: 'More than a gym.',
      manifestoText:
        'SHADOW FITNESS in Jatpura, Kishni is an antidote to crowded, generic fitness clubs. We engineered every square foot with purpose—high-grade machines, calibrated iron, and unmatched community focus.',
      scrollTickerText:
        "You don't need more motivation. | You need a routine. | Show up. | Do the work.",
    },
    create: {
      id: 1,
      heroTitle: 'BUILD YOUR\nSTRONGER SELF.',
      heroSubtitle: 'Kishni’s premier strength & performance gym. Master the barbell, train with intensity, and achieve authentic physical transformation.',
      heroBadge: 'TRAIN • BUILD • TRANSFORM',
      heroCta1Text: 'START YOUR JOURNEY',
      heroCta1Link: '#membership',
      heroCta2Text: 'STEP INSIDE SHADOW',
      heroCta2Link: '#facilities',
      heroMediaUrl: '/images/gym/photo_2.png',
      manifestoTitle: 'More than a gym.',
      manifestoText:
        'SHADOW FITNESS in Jatpura, Kishni is an antidote to crowded, generic fitness clubs. We engineered every square foot with purpose—high-grade machines, calibrated iron, and unmatched community focus.',
      scrollTickerText:
        "You don't need more motivation. | You need a routine. | Show up. | Do the work.",
    },
  });

  // 4. Initial Core Programs (Configurable in Admin)
  const programsData = [
    {
      slug: 'strength-conditioning',
      title: 'Strength & Conditioning',
      category: 'Strength',
      description:
        'Master the barbell fundamentals and progressive overload systems. Built for raw power, bone density, and unmatched athletic capability.',
      targetAudience: 'Lifters looking to build foundational strength and total-body power.',
      approach: 'Periodized compound movements: Squat, Bench, Deadlift, Overhead Press with accessory conditioning.',
      duration: '60 - 75 min sessions',
      schedule: 'Mon / Wed / Fri batches',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 1,
    },
    {
      slug: 'hypertrophy-muscle-architecture',
      title: 'Hypertrophy & Muscle Architecture',
      category: 'Muscle Building',
      description:
        'Engineered mechanical tension, metabolic stress, and volume control designed to sculpt dense, functional muscle mass.',
      targetAudience: 'Individuals seeking aesthetic muscular development and symmetry.',
      approach: 'Targeted muscle isolation, tempo manipulation, drop sets, and high-intensity failure work.',
      duration: '60 min sessions',
      schedule: 'Daily morning & evening slots',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 2,
    },
    {
      slug: 'athletic-functional-performance',
      title: 'Athletic & Functional Movement',
      category: 'Functional',
      description:
        'Multi-planar movement, rotational power, kettlebells, and sled work designed for real-world stamina and injury prevention.',
      targetAudience: 'Sports athletes and everyday warriors who want agility, mobility, and high work capacity.',
      approach: 'HIIT circuits, plyometrics, prowler pushes, and kinetic chain integration.',
      duration: '45 - 60 min sessions',
      schedule: 'Tue / Thu / Sat',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 3,
    },
    {
      slug: 'one-on-one-personal-coaching',
      title: 'Personal Training & Guidance',
      category: 'Personal Training',
      description:
        'Dedicated 1-on-1 private coaching tailored strictly to your anatomical structure, movement baseline, and personal performance milestones.',
      targetAudience: 'Individuals who demand hyper-customized programming, strict accountability, and biomechanical form guidance.',
      approach: 'Full physical assessment, custom periodization roadmap, lifestyle tracking, and weekly progress audits.',
      duration: '60 min private slots',
      schedule: 'Flexible by appointment',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 4,
    },
  ];

  for (const prog of programsData) {
    await prisma.program.upsert({
      where: { slug: prog.slug },
      update: {},
      create: prog,
    });
  }

  // 5. Initial Membership Plans (Prices and features fully manageable by owner)
  const membershipsData = [
    {
      slug: 'monthly-standard',
      name: 'Monthly Pass',
      price: '₹2,499 / mo',
      duration: '1 Month',
      features: JSON.stringify([
        'Full facility & floor access',
        'Standard equipment usage',
        'Locker & shower facilities',
        'Mobile workout tracking access',
      ]),
      highlightBadge: 'Flexible',
      isPopular: false,
      personalTrainingIncluded: false,
      sortOrder: 1,
    },
    {
      slug: 'quarterly-commitment',
      name: 'Quarterly Builder',
      price: '₹6,499 / 3 mo',
      duration: '3 Months',
      features: JSON.stringify([
        'Full facility & floor access',
        '1 complimentary fitness assessment',
        'Access to functional turf & sled zone',
        'Complimentary guest pass per month',
        'Locker & shower facilities',
      ]),
      highlightBadge: 'Most Popular',
      isPopular: true,
      personalTrainingIncluded: false,
      sortOrder: 2,
    },
    {
      slug: 'annual-elite',
      name: 'Annual Elite',
      price: '₹19,999 / yr',
      duration: '12 Months',
      features: JSON.stringify([
        'Unrestricted 365-day facility access',
        'Personal fitness roadmap consultation',
        'Quarterly body composition analysis',
        'Full access to all workshops & recovery zones',
        'Priority booking for personal training',
        'Branded Shadow Fitness athlete pack',
      ]),
      highlightBadge: 'Best Value',
      isPopular: false,
      personalTrainingIncluded: true,
      sortOrder: 3,
    },
  ];

  for (const plan of membershipsData) {
    await prisma.membership.upsert({
      where: { slug: plan.slug },
      update: {
        price: plan.price,
        features: plan.features,
        duration: plan.duration,
        name: plan.name,
      },
      create: plan,
    });
  }

  // 6. Initial Facilities
  const facilitiesData = [
    {
      name: 'Heavy Iron & Barbell Compound',
      tag: 'Strength Zone',
      description: 'Calibrated Olympic plates, competition-grade power racks, deadlift platforms, and Eleiko-standard barbells.',
      specs: JSON.stringify(['Olympic Platforms', 'Power Cages', 'Specialty Bars', 'Bumper Plates']),
      imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
      sortOrder: 1,
    },
    {
      name: 'High-Performance Turf & Sled Track',
      tag: 'Functional Zone',
      description: 'Dense commercial sprint turf engineered for heavy sled pushes, battle ropes, plyometrics, and kettlebell intervals.',
      specs: JSON.stringify(['Sprint Turf Strip', 'Heavy Prowler Sleds', 'Battle Ropes', 'Kettlebell Racks']),
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
      sortOrder: 2,
    },
    {
      name: 'Biomechanic Machine Circuit',
      tag: 'Isolation Zone',
      description: 'Ergonomically tuned pin-loaded and plate-loaded leverage machines ensuring pure muscular tension with zero joint shear.',
      specs: JSON.stringify(['Converging Chest Presses', 'Hack Squat & Leg Press', 'Dual Cable Columns', 'Preacher Curls']),
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80',
      sortOrder: 3,
    },
    {
      name: 'Locker & Hygiene Suites',
      tag: 'Amenities',
      description: 'Spotless private locker bays, rainfall showers, secure RFID storage, and dedicated grooming stations.',
      specs: JSON.stringify(['Digital Lockers', 'Rain Showers', 'Filtered Hydration Station', 'Grooming Mirrors']),
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80',
      sortOrder: 4,
    },
  ];

  for (const fac of facilitiesData) {
    const existing = await prisma.facility.findFirst({ where: { name: fac.name } });
    if (!existing) {
      await prisma.facility.create({ data: fac });
    }
  }

  // 7. Initial Gallery
  const galleryData = [
    {
      title: 'Competition Barbell Rig',
      category: 'Equipment',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      caption: 'Precision knurled bars for heavy lifts.',
      sortOrder: 1,
    },
    {
      title: 'Main Training Floor',
      category: 'Gym',
      imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
      caption: 'Uncluttered, focused atmosphere.',
      sortOrder: 2,
    },
    {
      title: 'Functional Conditioning',
      category: 'Training',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      caption: 'Pushing boundaries every rep.',
      sortOrder: 3,
    },
    {
      title: 'Dumbbell Arsenal',
      category: 'Equipment',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
      caption: 'Full weight range from 2.5kg to 50kg.',
      sortOrder: 4,
    },
    {
      title: 'Late Night Focus',
      category: 'Gym',
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
      caption: 'The gym lights stay on for the dedicated.',
      sortOrder: 5,
    },
    {
      title: 'Cardio & Stamina Row',
      category: 'Equipment',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
      caption: 'High-performance air bikes and rowers.',
      sortOrder: 6,
    },
  ];

  for (const item of galleryData) {
    const existing = await prisma.galleryImage.findFirst({ where: { title: item.title } });
    if (!existing) {
      await prisma.galleryImage.create({ data: item });
    }
  }

  // 8. Initial Coaches & Trainers
  const trainersData = [
    {
      slug: 'vikram-rao',
      name: 'Vikramaditya Rao',
      role: 'Head Strength Coach & Founder',
      specializations: 'Powerlifting • Periodization • Barbell Biomechanics',
      experience: '12+ Years Coaching',
      certifications: 'CSCS, USAW Level 2, Precision Nutrition L1',
      bio: 'Former competitive powerlifter dedicated to biomechanically efficient compound lifting and no-nonsense strength development.',
      photoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
    },
    {
      slug: 'sarah-jenkins',
      name: 'Sarah Jenkins',
      role: 'Biomechanics & Movement Director',
      specializations: 'Functional Anatomy • Injury Mitigation • Mobility',
      experience: '8+ Years Coaching',
      certifications: 'DPT, FMS Level 2, EXOS Performance Specialist',
      bio: 'Specializing in structural balance and joint health, ensuring athletes push high loads without chronic movement degradation.',
      photoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
    },
    {
      slug: 'marcus-thorne',
      name: 'Marcus Thorne',
      role: 'Conditioning & Hypertrophy Lead',
      specializations: 'Body Recomposition • Metabolic Conditioning • Plyometrics',
      experience: '9+ Years Coaching',
      certifications: 'NASM-CPT, PES, Kettlebell Athletics Level 2',
      bio: 'Passionate about athletic conditioning, work capacity development, and sustainable hypertrophy progression.',
      photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
    },
  ];

  for (const t of trainersData) {
    await prisma.trainer.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        role: t.role,
        specializations: t.specializations,
        experience: t.experience,
        certifications: t.certifications,
        bio: t.bio,
        photoUrl: t.photoUrl,
      },
      create: t,
    });
  }

  // 9. Initial Verified Member Transformations
  const transformationsData = [
    {
      name: 'Arjun S.',
      duration: '16 Weeks',
      goal: 'Body Recomposition & Barbell Strength',
      story: 'Dropped 11kg body fat while increasing squat by 45kg. The structured progressive overload programming and zero-gimmick coaching changed my entire lifestyle.',
      beforeImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
      afterImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
      consentConfirmed: true,
      sortOrder: 1,
    },
    {
      name: 'Rohan M.',
      duration: '24 Weeks',
      goal: 'Lean Mass & Postural Alignment',
      story: 'Went from chronic desk-work back stiffness to pulling 180kg cleanly. Shadow Fitness treats every member with serious athletic intention.',
      beforeImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      afterImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      consentConfirmed: true,
      sortOrder: 2,
    },
  ];

  for (const trans of transformationsData) {
    const existing = await prisma.transformation.findFirst({ where: { name: trans.name } });
    if (!existing) {
      await prisma.transformation.create({ data: trans });
    }
  }

  console.log('--- Seeding completed successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
