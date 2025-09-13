import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create law firms
  const lawFirm1 = await prisma.lawFirm.upsert({
    where: { id: 'law-firm-1' },
    update: {},
    create: {
      id: 'law-firm-1',
      name: 'Sharma & Associates',
      address: '123 Legal Street, New Delhi',
      phone: '+91-11-12345678',
      email: 'info@sharmaassociates.com',
      licenseNumber: 'LAW_FIRM_DEL_001',
    },
  });

  const lawFirm2 = await prisma.lawFirm.upsert({
    where: { id: 'law-firm-2' },
    update: {},
    create: {
      id: 'law-firm-2',
      name: 'Kumar Legal Services',
      address: '456 Justice Avenue, Mumbai',
      phone: '+91-22-87654321',
      email: 'contact@kumarlegal.com',
      licenseNumber: 'LAW_FIRM_MUM_002',
    },
  });

  // Create a judge
  const judge = await prisma.user.upsert({
    where: { email: 'judge@nyaysphere.com' },
    update: {},
    create: {
      email: 'judge@nyaysphere.com',
      password: hashedPassword,
      name: 'Justice Rajesh Kumar',
      role: 'JUDGE',
      courtId: 'DELHI_HIGH_COURT_001',
      phone: '+91-9876543210'
    }
  });

  // Create lawyers
  const lawyer = await prisma.user.upsert({
    where: { email: 'lawyer@nyaysphere.com' },
    update: {},
    create: {
      email: 'lawyer@nyaysphere.com',
      password: hashedPassword,
      name: 'Advocate Priya Sharma',
      role: 'LAWYER',
      barId: 'DELHI_BAR_001',
      phone: '+91-9876543211',
      lawFirmId: lawFirm1.id
    }
  });

  const lawyer2 = await prisma.user.upsert({
    where: { email: 'lawyer2@nyaysphere.com' },
    update: {},
    create: {
      email: 'lawyer2@nyaysphere.com',
      password: hashedPassword,
      name: 'Advocate Rajesh Kumar',
      role: 'LAWYER',
      barId: 'MUMBAI_BAR_002',
      phone: '+91-9876543212',
      lawFirmId: lawFirm2.id
    }
  });

  // Create a client
  const client = await prisma.user.upsert({
    where: { email: 'client@nyaysphere.com' },
    update: {},
    create: {
      email: 'client@nyaysphere.com',
      password: hashedPassword,
      name: 'Amit Singh',
      role: 'CLIENT',
      phone: '+91-9876543213'
    }
  });

  // Create IPC sections
  const ipcSections = [
    { sectionCode: '302', description: 'Murder' },
    { sectionCode: '376', description: 'Rape' },
    { sectionCode: '420', description: 'Cheating and dishonestly inducing delivery of property' },
    { sectionCode: '406', description: 'Criminal breach of trust' },
    { sectionCode: '498A', description: 'Husband or relative of husband of a woman subjecting her to cruelty' },
    { sectionCode: '138', description: 'Dishonour of cheque for insufficiency, etc., of funds in the account' },
    { sectionCode: '323', description: 'Punishment for voluntarily causing hurt' },
    { sectionCode: '506', description: 'Punishment for criminal intimidation' },
  ];

  for (const section of ipcSections) {
    await prisma.iPCSection.upsert({
      where: { sectionCode: section.sectionCode },
      update: {},
      create: section,
    });
  }

  // Create historical cases for analytics
  const historicalCases = [
    {
      caseNumber: 'HC-2022-001',
      title: 'State vs. John Doe - Murder Case',
      type: 'MURDER',
      subtype: 'First Degree',
      status: 'CLOSED',
      urgency: 'HIGH',
      outcome: 'WON',
      duration: 365,
      complexity: 'COMPLEX',
      judgeName: 'Justice Rajesh Kumar',
      lawyerName: 'Advocate Priya Sharma',
      ipcSections: JSON.stringify(['302']),
      documents: 25,
      hearingCount: 12,
    },
    {
      caseNumber: 'HC-2022-002',
      title: 'ABC Corp vs. XYZ Ltd - Fraud Case',
      type: 'FRAUD',
      subtype: 'Corporate Fraud',
      status: 'CLOSED',
      urgency: 'MEDIUM',
      outcome: 'SETTLED',
      duration: 180,
      complexity: 'MODERATE',
      judgeName: 'Justice Rajesh Kumar',
      lawyerName: 'Advocate Rajesh Kumar',
      ipcSections: JSON.stringify(['420', '406']),
      documents: 15,
      hearingCount: 8,
    },
    {
      caseNumber: 'HC-2022-003',
      title: 'Mrs. Sharma vs. Mr. Sharma - Divorce Case',
      type: 'DIVORCE',
      subtype: 'Mutual Consent',
      status: 'CLOSED',
      urgency: 'LOW',
      outcome: 'WON',
      duration: 90,
      complexity: 'SIMPLE',
      judgeName: 'Justice Rajesh Kumar',
      lawyerName: 'Advocate Priya Sharma',
      ipcSections: JSON.stringify(['498A']),
      documents: 8,
      hearingCount: 4,
    },
    {
      caseNumber: 'HC-2022-004',
      title: 'Bank vs. Customer - Cheque Bounce Case',
      type: 'FRAUD',
      subtype: 'Cheque Bounce',
      status: 'CLOSED',
      urgency: 'MEDIUM',
      outcome: 'LOST',
      duration: 120,
      complexity: 'SIMPLE',
      judgeName: 'Justice Rajesh Kumar',
      lawyerName: 'Advocate Rajesh Kumar',
      ipcSections: JSON.stringify(['138']),
      documents: 5,
      hearingCount: 3,
    },
    {
      caseNumber: 'HC-2022-005',
      title: 'State vs. Accused - Assault Case',
      type: 'ASSAULT',
      subtype: 'Physical Assault',
      status: 'CLOSED',
      urgency: 'MEDIUM',
      outcome: 'WON',
      duration: 60,
      complexity: 'SIMPLE',
      judgeName: 'Justice Rajesh Kumar',
      lawyerName: 'Advocate Priya Sharma',
      ipcSections: JSON.stringify(['323', '506']),
      documents: 10,
      hearingCount: 5,
    },
  ];

  for (const caseData of historicalCases) {
    await prisma.historicalCase.create({
      data: caseData,
    });
  }

  console.log('✅ Test users created:');
  console.log('👨‍⚖️  Judge:', judge.email, '(password: password123)');
  console.log('⚖️  Lawyer:', lawyer.email, '(password: password123)');
  console.log('⚖️  Lawyer2:', lawyer2.email, '(password: password123)');
  console.log('👤 Client:', client.email, '(password: password123)');
  console.log('🏢 Law firms created:', lawFirm1.name, '&', lawFirm2.name);
  console.log('📋 IPC sections created:', ipcSections.length);
  console.log('📊 Historical cases created:', historicalCases.length);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });