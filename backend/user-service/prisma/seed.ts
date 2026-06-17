import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const crops = [
  { name_en: "Rice", name_ne: "धान", description_en: "Main staple crop", description_ne: "मुख्य खाद्य बाली" },
  { name_en: "Maize", name_ne: "मकै", description_en: "Second most important crop", description_ne: "दोस्रो महत्त्वपूर्ण बाली" },
  { name_en: "Wheat", name_ne: "गहुँ", description_en: "Winter crop", description_ne: "जाडो बाली" },
  { name_en: "Potato", name_ne: "आलु", description_en: "Cash crop", description_ne: "नगदे बाली" },
  { name_en: "Tomato", name_ne: "टमाटर", description_en: "Vegetable crop", description_ne: "तरकारी बाली" },
];

async function main() {
  console.log('🌱 Seeding user service database...\n');

  for (const crop of crops) {
    await prisma.crop.upsert({
      where: { name_en: crop.name_en },
      update: {},
      create: crop
    });
    console.log(`✅ Crop: ${crop.name_en} (${crop.name_ne})`);
  }

  console.log('\n🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });