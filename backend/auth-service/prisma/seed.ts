import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n🌱 Seeding admin user...\n');

  const adminUsers = [
    {
      phone: "9700742710",
      name: "Admin User",
      nameNe: "प्रशासक",
      email: "admin@krishisahayak.com",  // ✅ Now works!
      role: "admin",
      province: "Bagmati",
      district: "Kathmandu",
      municipality: "Kathmandu-10",
      isActive: true
    }
  ];

  for (const adminData of adminUsers) {
    const admin = await prisma.user.upsert({
      where: { phone: adminData.phone },
      update: adminData,
      create: adminData
    });
    console.log(`✅ Admin created: ${admin.name} (${admin.phone})`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
  }

  console.log('\n🎉 Seeding completed!\n');
  console.log('📋 Admin Login Credentials:');
  console.log('─────────────────────────────────');
  console.log('👑 Admin:');
  console.log('   Phone: 9700742710');
  console.log('   Email: admin@krishisahayak.com');
  console.log('   Role: Admin');
  console.log('─────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });