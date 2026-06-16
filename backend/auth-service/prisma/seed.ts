import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n🌱 Seeding database...\n');
  
  const testUsers = [
    { phone: "9800000000", name: "Ram Bahadur", nameNe: "राम बहादुर", province: "Bagmati", district: "Kathmandu" },
    { phone: "9812345678", name: "Sita Devi", nameNe: "सीता देवी", province: "Lumbini", district: "Rupandehi" },
  ];

  for (const userData of testUsers) {
    const user = await prisma.user.upsert({
      where: { phone: userData.phone },
      update: {},
      create: { ...userData, language: 'ne', isActive: true }
    });
    console.log(`✅ User: ${user.nameNe} (${user.phone})`);
  }

  console.log('\n🎉 Seeding completed!\n');
  console.log('📱 Test accounts:');
  console.log('   1. Phone: 9800000000 (Ram Bahadur)');
  console.log('   2. Phone: 9812345678 (Sita Devi)\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });