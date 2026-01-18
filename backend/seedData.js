const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
require('./models/User');
require('./models/Company');
require('./models/Product');
require('./models/Lead');
require('./models/Promotion');
require('./models/AffiliateLink');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rave');

const User = mongoose.model('User');
const Company = mongoose.model('Company');
const Product = mongoose.model('Product');
const Lead = mongoose.model('Lead');
const Promotion = mongoose.model('Promotion');
const AffiliateLink = mongoose.model('AffiliateLink');

// Sample data
const sampleUsers = [
  // Admin user
  {
    name: 'Admin User',
    email: 'admin@rave.com',
    phone: '+1234567890',
    password: 'admin123',
    userType: 'admin',
    nationalIdNumber: 'ADMIN001',
    nationalIdImage: 'admin_default.jpg',
    isVerified: true,
    verificationStatus: 'verified'
  },
  // Support user
  {
    name: 'Support User',
    email: 'support@rave.com',
    phone: '+1234567891',
    password: 'support123',
    userType: 'support',
    nationalIdNumber: 'SUPPORT001',
    nationalIdImage: 'support_default.jpg',
    isVerified: true,
    verificationStatus: 'verified'
  },
  // Creator users
  {
    name: 'Creator John Doe',
    email: 'creator1@rave.com',
    phone: '+1234567892',
    password: 'creator123',
    userType: 'creator',
    nationalIdNumber: 'CREATOR001',
    nationalIdImage: 'creator_default.jpg',
    isVerified: true,
    verificationStatus: 'verified',
    socialAccounts: [
      {
        platform: 'instagram',
        username: 'johndoe_insta',
        url: 'https://instagram.com/johndoe_insta',
        followers: 15000
      },
      {
        platform: 'youtube',
        username: 'johndoe_youtube',
        url: 'https://youtube.com/user/johndoe',
        followers: 8500
      }
    ]
  },
  {
    name: 'Creator Jane Smith',
    email: 'creator2@rave.com',
    phone: '+1234567893',
    password: 'creator123',
    userType: 'creator',
    nationalIdNumber: 'CREATOR002',
    nationalIdImage: 'creator_default.jpg',
    isVerified: true,
    verificationStatus: 'verified',
    socialAccounts: [
      {
        platform: 'tiktok',
        username: 'janesmith_tiktok',
        url: 'https://tiktok.com/@janesmith',
        followers: 25000
      },
      {
        platform: 'twitter',
        username: 'janesmith_tweets',
        url: 'https://twitter.com/janesmith',
        followers: 12000
      }
    ]
  },
  // Sales agent users
  {
    name: 'Sales Agent Mike Johnson',
    email: 'sales1@rave.com',
    phone: '+1234567894',
    password: 'sales123',
    userType: 'sales_agent',
    nationalIdNumber: 'SALES001',
    nationalIdImage: 'sales_default.jpg',
    isVerified: true,
    verificationStatus: 'verified',
    weeklyTestScore: {
      score: 85,
      date: new Date()
    }
  },
  {
    name: 'Sales Agent Sarah Williams',
    email: 'sales2@rave.com',
    phone: '+1234567895',
    password: 'sales123',
    userType: 'sales_agent',
    nationalIdNumber: 'SALES002',
    nationalIdImage: 'sales_default.jpg',
    isVerified: true,
    verificationStatus: 'verified',
    weeklyTestScore: {
      score: 92,
      date: new Date()
    }
  }
];

const sampleCompanies = [
  {
    name: 'Tech Innovations Inc.',
    description: 'Leading tech company specializing in software solutions',
    logoUrl: 'https://via.placeholder.com/150x150.png?text=Tech+Innovations',
    website: 'https://techinnovations.com',
    industry: 'Technology',
    contactEmail: 'contact@techinnovations.com',
    contactPhone: '+1987654321',
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      zipCode: '94105'
    }
  },
  {
    name: 'Fashion Forward Ltd.',
    description: 'Premium fashion brand for modern consumers',
    logoUrl: 'https://via.placeholder.com/150x150.png?text=Fashion+Forward',
    website: 'https://fashionforward.com',
    industry: 'Fashion',
    contactEmail: 'hello@fashionforward.com',
    contactPhone: '+1876543210',
    address: {
      street: '456 Fashion Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001'
    }
  }
];

const sampleProducts = [
  {
    name: 'Premium Software Suite',
    description: 'Advanced software package for business productivity',
    price: 99.99,
    commissionRate: 15,
    company: null, // Will be filled after company is created
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Software+Suite',
    promotionalText: 'Boost your productivity with our premium suite!',
    paymentLink: 'https://techinnovations.com/pay/software-suite'
  },
  {
    name: 'Designer Handbag Collection',
    description: 'Exclusive handbag collection for fashion enthusiasts',
    price: 199.99,
    commissionRate: 20,
    company: null, // Will be filled after company is created
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Handbag',
    promotionalText: 'Elevate your style with our designer collection!',
    paymentLink: 'https://fashionforward.com/pay/handbags'
  },
  {
    name: 'Online Course Bundle',
    description: 'Comprehensive course bundle for digital marketing',
    price: 149.99,
    commissionRate: 25,
    company: null, // Will be filled after company is created
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Course+Bundle',
    promotionalText: 'Master digital marketing with our expert courses!',
    paymentLink: 'https://techinnovations.com/pay/course-bundle'
  }
];

const sampleLeads = [
  {
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@email.com',
    phone: '+1123456789',
    company: null, // Will be filled after company is created
    assignedTo: null, // Will be filled after sales agent is created
    status: 'new',
    source: 'affiliate_link',
    value: {
      estimatedValue: 200,
      actualValue: 0
    }
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@email.com',
    phone: '+1987654321',
    company: null, // Will be filled after company is created
    assignedTo: null, // Will be filled after sales agent is created
    status: 'contacted',
    source: 'advertisement',
    value: {
      estimatedValue: 150,
      actualValue: 0
    }
  }
];

const samplePromotions = [
  {
    title: 'Summer Sales Contest',
    description: 'Win an iPhone 15 by reaching $1000 in sales',
    type: 'contest',
    reward: 'iPhone 15',
    criteria: 'Reach $1000 in sales',
    targetAmount: 1000,
    targetAction: 'sales',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isActive: true,
    maxParticipants: 100,
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Summer+Contest'
  },
  {
    title: 'Top Performer Bonus',
    description: 'Extra 10% bonus for top 10 performers this month',
    type: 'bonus',
    reward: '10% Extra Commission',
    criteria: 'Be in top 10 performers',
    targetAmount: 500,
    targetAction: 'sales',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isActive: true,
    maxParticipants: 0, // Unlimited
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Bonus+Program'
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Company.deleteMany();
    await Product.deleteMany();
    await Lead.deleteMany();
    await Promotion.deleteMany();
    await AffiliateLink.deleteMany();

    console.log('Creating companies...');
    const createdCompanies = [];
    for (const companyData of sampleCompanies) {
      const company = new Company(companyData);
      await company.save();
      createdCompanies.push(company);
      console.log(`Created company: ${company.name}`);
    }

    console.log('Creating products...');
    const createdProducts = [];
    for (let i = 0; i < sampleProducts.length; i++) {
      const productData = { ...sampleProducts[i] };
      // Assign to first company for first two products, second company for third
      productData.company = createdCompanies[i % createdCompanies.length]._id;
      const product = new Product(productData);
      await product.save();
      createdProducts.push(product);
      console.log(`Created product: ${product.name}`);
    }

    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name} (${user.userType})`);
    }

    console.log('Updating products with company IDs...');
    for (let i = 0; i < sampleProducts.length; i++) {
      await Product.findByIdAndUpdate(
        createdProducts[i]._id,
        { company: createdCompanies[i % createdCompanies.length]._id }
      );
    }

    console.log('Creating leads...');
    const createdLeads = [];
    for (let i = 0; i < sampleLeads.length; i++) {
      const leadData = { ...sampleLeads[i] };
      leadData.company = createdCompanies[i % createdCompanies.length]._id;
      // Assign to sales agents alternately
      leadData.assignedTo = createdUsers.find(u => u.userType === 'sales_agent')._id;
      const lead = new Lead(leadData);
      await lead.save();
      createdLeads.push(lead);
      console.log(`Created lead: ${lead.firstName} ${lead.lastName}`);
    }

    console.log('Creating promotions...');
    for (const promoData of samplePromotions) {
      const promo = new Promotion(promoData);
      await promo.save();
      console.log(`Created promotion: ${promo.title}`);
    }

    console.log('Database seeding completed successfully!');
    
    // Print login credentials
    console.log('\n--- LOGIN CREDENTIALS ---');
    console.log('Admin:');
    console.log('  Email: admin@rave.com');
    console.log('  Password: admin123');
    console.log('\nSupport:');
    console.log('  Email: support@rave.com');
    console.log('  Password: support123');
    console.log('\nCreators:');
    console.log('  Email: creator1@rave.com');
    console.log('  Password: creator123');
    console.log('  Email: creator2@rave.com');
    console.log('  Password: creator123');
    console.log('\nSales Agents:');
    console.log('  Email: sales1@rave.com');
    console.log('  Password: sales123');
    console.log('  Email: sales2@rave.com');
    console.log('  Password: sales123');
    console.log('-------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();