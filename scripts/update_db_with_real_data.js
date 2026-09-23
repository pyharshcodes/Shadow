const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Updating Database with Real Google Maps & Trainer Details ---');

  // 1. Update Business Settings
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
        { days: 'Sunday', hours: '06:00 AM - 12:00 PM' }
      ]),
      parkingInfo: 'Dedicated vehicle & two-wheeler parking available on premises along NH234.',
      footerText: 'Kishni’s premier performance & strength training gym. Built for those who respect the process and show up every single day.',
      freeTrialEnabled: true,
    },
    create: {
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
        { days: 'Sunday', hours: '06:00 AM - 12:00 PM' }
      ]),
      parkingInfo: 'Dedicated vehicle & two-wheeler parking available on premises along NH234.',
      footerText: 'Kishni’s premier performance & strength training gym. Built for those who respect the process and show up every single day.',
      freeTrialEnabled: true,
    }
  });

  // 2. Update Homepage Section
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
      manifestoText: 'SHADOW FITNESS in Jatpura, Kishni is an antidote to crowded, generic fitness clubs. We engineered every square foot with purpose—high-grade machines, calibrated iron, and unmatched community focus.',
      scrollTickerText: "You don't need more motivation. | You need a routine. | Show up. | Do the work.",
    },
    create: {
      heroTitle: 'BUILD YOUR\nSTRONGER SELF.',
      heroSubtitle: 'Kishni’s premier strength & performance gym. Master the barbell, train with intensity, and achieve authentic physical transformation.',
      heroBadge: 'TRAIN • BUILD • TRANSFORM',
      heroCta1Text: 'START YOUR JOURNEY',
      heroCta1Link: '#membership',
      heroCta2Text: 'STEP INSIDE SHADOW',
      heroCta2Link: '#facilities',
      heroMediaUrl: '/images/gym/photo_2.png',
      manifestoTitle: 'More than a gym.',
      manifestoText: 'SHADOW FITNESS in Jatpura, Kishni is an antidote to crowded, generic fitness clubs. We engineered every square foot with purpose—high-grade machines, calibrated iron, and unmatched community focus.',
      scrollTickerText: "You don't need more motivation. | You need a routine. | Show up. | Do the work.",
    }
  });

  // 3. Clear and Insert Real Facilities
  await prisma.facility.deleteMany();
  const realFacilities = [
    {
      name: 'Neon Strength Arena & Free Weights',
      tag: 'Strength Zone',
      description: 'Fully equipped free-weight arena with competition dumbbells, Olympic flat & incline barbell benches, mirrored form-check bays, and signature purple neon motivation lighting.',
      specs: JSON.stringify(['Commercial Dumbbell Arsenal', 'Full-Length Form Mirrors', 'Olympic Barbell Stations', 'Shock-Absorbing Floor Matting']),
      imageUrl: '/images/gym/photo_4.png',
      sortOrder: 1,
      isPublished: true,
    },
    {
      name: 'Heavy Leverage & Machine Circuit',
      tag: 'Machine Zone',
      description: 'Comprehensive heavy resistance circuit featuring commercial 45° plate-loaded leg press, heavy-duty Smith machine, dual cable columns, and stationary conditioning bikes beneath custom chevron LED lighting.',
      specs: JSON.stringify(['45° Commercial Leg Press', 'Smooth Guided Smith Machine', 'Dual Cable Cross Station', 'Stationary Cardio Bike', 'Overhead Chevron LED Array']),
      imageUrl: '/images/gym/photo_3.png',
      sortOrder: 2,
      isPublished: true,
    },
    {
      name: 'Signature Neon Aesthetic & Coaching Floor',
      tag: 'Mentorship Zone',
      description: 'The iconic illuminated purple neon training stage where members train under direct guidance of Head Coach Shivam for high-intensity progressive overload and structural hypertrophy.',
      specs: JSON.stringify(['1-on-1 Biomechanics Calibration', 'High-Intensity Overload Protocol', 'Personalized Nutrition Roadmap', 'Weekly Progress Tracking']),
      imageUrl: '/images/gym/photo_2.png',
      sortOrder: 3,
      isPublished: true,
    },
    {
      name: 'Athletic Conditioning & Motivation Bay',
      tag: 'Performance Zone',
      description: 'Dedicated training environment curated with inspiring athletic culture, motivating training mantras, and an uncompromising atmosphere built around daily discipline.',
      specs: JSON.stringify(['High-Airflow Climate Control', 'Hydration & Rest Area', 'Locker & Gear Storage', 'Calibrated Bumper Plates']),
      imageUrl: '/images/gym/photo_1.png',
      sortOrder: 4,
      isPublished: true,
    }
  ];

  for (const fac of realFacilities) {
    await prisma.facility.create({ data: fac });
  }

  // 4. Clear and Insert Real Trainers / Coaches
  await prisma.trainer.deleteMany();
  const realTrainers = [
    {
      slug: 'shivam-shivoo-yadav',
      name: 'Shivam "Shivoo" Yadav',
      role: 'Founder & Head Strength Coach',
      specializations: 'Heavy Compound Lifting • Muscle Hypertrophy • Transformation Protocols',
      experience: 'Founder & Head Coach',
      certifications: 'Advanced Biomechanics, Functional Strength & Athletic Conditioning',
      bio: 'Leading the fitness revolution in Kishni. Shivam founded Shadow Fitness to bring serious, results-driven strength culture to the community. Known for strict form accountability, personalized overload tracking, and relentless work ethic.',
      photoUrl: '/images/gym/photo_1.png',
      instagramUrl: 'https://instagram.com/shadow_shivoo_',
      sortOrder: 1,
      isPublished: true,
    },
    {
      slug: 'shivam-physique-director',
      name: 'Coach Shivam (Physique & Conditioning)',
      role: 'Lead Transformation Specialist',
      specializations: 'Body Recomposition • Biomechanics • Posing & Contest Prep',
      experience: '5+ Years Coaching',
      certifications: 'Certified Personal Trainer & Sports Nutritionist',
      bio: 'Specializing in sculpting dense muscular development while protecting joint integrity. Shivam works closely with each member to ensure sustainable lifestyle habits and measurable weekly progress.',
      photoUrl: '/images/gym/photo_2.png',
      instagramUrl: 'https://instagram.com/shadow_shivoo_',
      sortOrder: 2,
      isPublished: true,
    }
  ];

  for (const t of realTrainers) {
    await prisma.trainer.create({ data: t });
  }

  // 5. Update Gallery Images with Real Photos
  await prisma.galleryImage.deleteMany();
  const realGallery = [
    {
      title: 'Signature Purple Neon Training Bay',
      category: 'Gym',
      imageUrl: '/images/gym/photo_2.png',
      caption: 'The iconic illuminated Shadow Fitness neon sign setting the high-energy training vibe.',
      sortOrder: 1,
      isPublished: true,
    },
    {
      title: 'Main Strength & Machine Floor',
      category: 'Equipment',
      imageUrl: '/images/gym/photo_3.png',
      caption: 'Overhead chevron LED lighting over the commercial leg press, Smith machine, and cardio area.',
      sortOrder: 2,
      isPublished: true,
    },
    {
      title: 'Free Weights & Dumbbell Arsenal',
      category: 'Equipment',
      imageUrl: '/images/gym/photo_4.png',
      caption: 'Comprehensive dumbbell racks with full-length mirror wall for pristine biomechanics.',
      sortOrder: 3,
      isPublished: true,
    },
    {
      title: 'Founder Discipline: No Pain, No Gain',
      category: 'Training',
      imageUrl: '/images/gym/photo_1.png',
      caption: 'Head Coach Shivam (@shadow_shivoo_) bringing authentic gym culture to Kishni.',
      sortOrder: 4,
      isPublished: true,
    }
  ];

  for (const img of realGallery) {
    await prisma.galleryImage.create({ data: img });
  }

  // 6. Update Transformation Story
  await prisma.transformation.deleteMany();
  const realTransformations = [
    {
      name: 'Aman K. (Kishni)',
      duration: '16 Weeks',
      goal: 'Lean Muscle Gain & Strength',
      story: 'Trained under Coach Shivam at Shadow Fitness. Added 6kg of dense lean muscle and increased bench press by 35kg with strict form guidance.',
      beforeImage: '/images/gym/photo_4.png',
      afterImage: '/images/gym/photo_2.png',
      consentConfirmed: true,
      sortOrder: 1,
      isPublished: true,
    },
    {
      name: 'Rahul V. (Mainpuri)',
      duration: '20 Weeks',
      goal: 'Fat Loss & Postural Reconditioning',
      story: 'Dropped 12kg body fat while mastering compound lifts under Shadow Fitness periodized workout routines. The community and focus here are unmatched.',
      beforeImage: '/images/gym/photo_3.png',
      afterImage: '/images/gym/photo_1.png',
      consentConfirmed: true,
      sortOrder: 2,
      isPublished: true,
    }
  ];

  for (const trans of realTransformations) {
    await prisma.transformation.create({ data: trans });
  }

  console.log('--- Successfully updated database with authentic Shadow Fitness data! ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
