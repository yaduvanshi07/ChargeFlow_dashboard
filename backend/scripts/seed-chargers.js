const mongoose = require('mongoose');
const Charger = require('./models/Charger');
const Transaction = require('./models/Transaction');
require('dotenv').config();

// Sample charger data
const sampleChargers = [
  {
    name: 'Premium DC Charger #1',
    location: 'Sector 18, Noida',
    type: 'DC_FAST',
    power: 50,
    status: 'ONLINE',
    utilization: 87,
    totalSessions: 45
  },
  {
    name: 'Premium AC Charger #1',
    location: 'Sector 18, Noida',
    type: 'AC_FAST',
    power: 7.2,
    status: 'ONLINE',
    utilization: 92,
    totalSessions: 38
  },
  {
    name: 'Premium DC Charger #2',
    location: 'Sector 18, Noida',
    type: 'DC_FAST',
    power: 150,
    status: 'ONLINE',
    utilization: 65,
    totalSessions: 44
  },
  {
    name: 'Standard AC Charger #1',
    location: 'Sector 62, Noida',
    type: 'AC',
    power: 3.3,
    status: 'OFFLINE',
    utilization: 0,
    totalSessions: 0
  },
  {
    name: 'Standard DC Charger #1',
    location: 'Sector 62, Noida',
    type: 'DC',
    power: 30,
    status: 'OFFLINE',
    utilization: 0,
    totalSessions: 12
  }
];

// Sample transaction data for Total Revenue
const sampleTransactions = [
  { amount: 450, source: 'CHARGING', description: 'DC Fast Charging - Honda Accord' },
  { amount: 500, source: 'CHARGING', description: 'AC Fast Charging - Ford Explorer' },
  { amount: 400, source: 'CHARGING', description: 'Standard AC Charging - Toyota Camry' },
  { amount: 399, source: 'CHARGING', description: 'DC Fast Charging - Honda Accord' },
  { amount: 500, source: 'CHARGING', description: 'AC Fast Charging - Ford Explorer' },
  { amount: 1200, source: 'WALLET', description: 'Wallet Top-up' },
  { amount: 800, source: 'WALLET', description: 'Wallet Top-up' },
  { amount: 1500, source: 'WALLET', description: 'Wallet Top-up' },
  { amount: 350, source: 'CHARGING', description: 'Standard DC Charging - Mahindra XUV400' },
  { amount: 600, source: 'CHARGING', description: 'DC Fast Charging - Tata Nexon EV' },
  { amount: 450, source: 'CHARGING', description: 'AC Fast Charging - Ola Electric S1 Pro' },
  { amount: 380, source: 'CHARGING', description: 'Standard AC Charging - Ather 450X' },
  { amount: 2000, source: 'WALLET', description: 'Wallet Top-up' },
  { amount: 750, source: 'CHARGING', description: 'DC Fast Charging - MG ZS EV' },
  { amount: 420, source: 'CHARGING', description: 'AC Fast Charging - Hyundai Kona Electric' },
  { amount: 1800, source: 'WALLET', description: 'Wallet Top-up' },
  { amount: 550, source: 'CHARGING', description: 'DC Fast Charging - Kia EV6' },
  { amount: 390, source: 'CHARGING', description: 'Standard AC Charging - Renault Kwid Electric' },
  { amount: 650, source: 'CHARGING', description: 'DC Fast Charging - Porsche Taycan' },
  { amount: 480, source: 'CHARGING', description: 'AC Fast Charging - BMW i4' },
  { amount: 2200, source: 'WALLET', description: 'Wallet Top-up' },
  { amount: 520, source: 'CHARGING', description: 'DC Fast Charging - Audi e-tron' },
  { amount: 410, source: 'CHARGING', description: 'Standard AC Charging - Nissan Leaf' },
  { amount: 700, source: 'CHARGING', description: 'DC Fast Charging - Mercedes EQC' },
  { amount: 360, source: 'CHARGING', description: 'AC Fast Charging - Tesla Model 3' },
  { amount: 1300, source: 'WALLET', description: 'Wallet Top-up' },
  { amount: 580, source: 'CHARGING', description: 'DC Fast Charging - Jaguar I-PACE' },
  { amount: 440, source: 'CHARGING', description: 'Standard AC Charging - VW ID.4' },
  { amount: 680, source: 'CHARGING', description: 'DC Fast Charging - Volvo XC40 Recharge' },
  { amount: 370, source: 'CHARGING', description: 'AC Fast Charging - Ford Mustang Mach-E' },
  { amount: 720, source: 'CHARGING', description: 'DC Fast Charging - Polestar 2' },
  { amount: 340, source: 'CHARGING', description: 'Standard AC Charging - Hyundai Ioniq 5' },
  { amount: 660, source: 'CHARGING', description: 'DC Fast Charging - Genesis GV60' },
  { amount: 390, source: 'CHARGING', description: 'AC Fast Charging - Kia EV9' },
  { amount: 740, source: 'CHARGING', description: 'DC Fast Charging - Cadillac Lyriq' },
  { amount: 320, source: 'CHARGING', description: 'Standard AC Charging - Chevrolet Bolt EV' },
  { amount: 620, source: 'CHARGING', description: 'DC Fast Charging - Lucid Air' },
  { amount: 460, source: 'CHARGING', description: 'AC Fast Charging - Rivian R1T' },
  { amount: 760, source: 'CHARGING', description: 'DC Fast Charging - Fisker Ocean' },
  { amount: 350, source: 'CHARGING', description: 'Standard AC Charging - Mini Cooper SE' },
  { amount: 640, source: 'CHARGING', description: 'DC Fast Charging - Lotus Eletre' },
  { amount: 430, source: 'CHARGING', description: 'AC Fast Charging - Rolls Royce Spectre' },
  { amount: 780, source: 'CHARGING', description: 'DC Fast Charging - Bentley Flying Spur Hybrid' },
  { amount: 300, source: 'CHARGING', description: 'Standard AC Charging - Fiat 500e' },
  { amount: 600, source: 'CHARGING', description: 'DC Fast Charging - Maserati GranTurismo Folgore' },
  { amount: 470, source: 'CHARGING', description: 'AC Fast Charging - Aston Martin DBX' },
  { amount: 800, source: 'CHARGING', description: 'DC Fast Charging - Ferrari SF90 Stradale' },
  { amount: 330, source: 'CHARGING', description: 'Standard AC Charging - Smart EQ Fortwo' },
  { amount: 560, source: 'CHARGING', description: 'DC Fast Charging - Lamborghini Urus Hybrid' },
  { amount: 490, source: 'CHARGING', description: 'AC Fast Charging - McLaren Artura' },
  { amount: 820, source: 'CHARGING', description: 'DC Fast Charging - Bugatti Chiron' },
  { amount: 310, source: 'CHARGING', description: 'Standard AC Charging - Honda e' },
  { amount: 540, source: 'CHARGING', description: 'DC Fast Charging - Toyota bZ4X' },
  { amount: 450, source: 'CHARGING', description: 'AC Fast Charging - Subaru Solterra' },
  { amount: 760, source: 'CHARGING', description: 'DC Fast Charging - Lexus RZ 450e' },
  { amount: 380, source: 'CHARGING', description: 'Standard AC Charging - Mazda MX-30' },
  { amount: 580, source: 'CHARGING', description: 'DC Fast Charging - Genesis Electrified G80' },
  { amount: 420, source: 'CHARGING', description: 'AC Fast Charging - Hyundai Nexo' },
  { amount: 700, source: 'CHARGING', description: 'DC Fast Charging - Toyota Mirai' },
  { amount: 340, source: 'CHARGING', description: 'Standard AC Charging - Honda Clarity Fuel Cell' },
  { amount: 560, source: 'CHARGING', description: 'DC Fast Charging - Nikola Tre' },
  { amount: 480, source: 'CHARGING', description: 'AC Fast Charging - VinFast VF 8' },
  { amount: 640, source: 'CHARGING', description: 'DC Fast Charging - Aiways U5' },
  { amount: 360, source: 'CHARGING', description: 'Standard AC Charging - Nio ES8' },
  { amount: 520, source: 'CHARGING', description: 'DC Fast Charging - Xpeng P7' },
  { amount: 440, source: 'CHARGING', description: 'AC Fast Charging - BYD Han EV' },
  { amount: 680, source: 'CHARGING', description: 'DC Fast Charging - Li Auto L9' },
  { amount: 320, source: 'CHARGING', description: 'Standard AC Charging - XPeng G3i' },
  { amount: 540, source: 'CHARGING', description: 'DC Fast Charging - Zeekr 001' },
  { amount: 460, source: 'CHARGING', description: 'AC Fast Charging - Ora Cat' },
  { amount: 600, source: 'CHARGING', description: 'DC Fast Charging - Haval Jolion HEV' },
  { amount: 380, source: 'CHARGING', description: 'Standard AC Charging - Changan E-Star' },
  { amount: 500, source: 'CHARGING', description: 'DC Fast Charging - GAC Aion S' },
  { amount: 420, source: 'CHARGING', description: 'AC Fast Charging - Brilliance EV' },
  { amount: 560, source: 'CHARGING', description: 'DC Fast Charging - JAC iEV7S' },
  { amount: 340, source: 'CHARGING', description: 'Standard AC Charging - BAIC EU5' },
  { amount: 480, source: 'CHARGING', description: 'DC Fast Charging - Chery eQ1' },
  { amount: 400, source: 'CHARGING', description: 'AC Fast Charging - Zotye E200' },
  { amount: 520, source: 'CHARGING', description: 'DC Fast Charging - Landwind EV2' },
  { amount: 360, source: 'CHARGING', description: 'Standard AC Charging - Jiangling E100L' },
  { amount: 440, source: 'CHARGING', description: 'DC Fast Charging - Wuling Hongguang Mini EV' },
  { amount: 380, source: 'CHARGING', description: 'AC Fast Charging - Baojun E200' },
  { amount: 460, source: 'CHARGING', description: 'DC Fast Charging - Jac iEV6E' },
  { amount: 320, source: 'CHARGING', description: 'Standard AC Charging - Leapmotor T03' },
  { amount: 400, source: 'CHARGING', description: 'DC Fast Charging - Haima 8X' },
  { amount: 340, source: 'CHARGING', description: 'AC Fast Charging - GWM Ora R1' },
  { amount: 420, source: 'CHARGING', description: 'DC Fast Charging - Foton Toano EV' },
  { amount: 300, source: 'CHARGING', description: 'Standard AC Charging - Yudo Auto EV' },
  { amount: 360, source: 'CHARGING', description: 'DC Fast Charging - Skywell ET5' },
  { amount: 380, source: 'CHARGING', description: 'AC Fast Charging - Aiways U6' },
  { amount: 400, source: 'CHARGING', description: 'DC Fast Charging - Singulato iS6' },
  { amount: 320, source: 'CHARGING', description: 'Standard AC Charging - Byton K-Byte' },
  { amount: 340, source: 'CHARGING', description: 'DC Fast Charging - Enovate ME7' },
  { amount: 360, source: 'CHARGING', description: 'AC Fast Charging - Weltmeister EX5' },
  { amount: 300, source: 'CHARGING', description: 'Standard AC Charging - Qiantu K50' },
  { amount: 320, source: 'CHARGING', description: 'DC Fast Charging - Youxia X' },
  { amount: 340, source: 'CHARGING', description: 'AC Fast Charging - Future Mobility Byton M-Byte' },
  { amount: 360, source: 'CHARGING', description: 'DC Fast Charging - Pininfarina Battista' },
  { amount: 280, source: 'CHARGING', description: 'Standard AC Charging - Rimac C_Two' },
  { amount: 300, source: 'CHARGING', description: 'DC Fast Charging - Aspark Owl' },
  { amount: 320, source: 'CHARGING', description: 'AC Fast Charging - Drako GTE' },
  { amount: 340, source: 'CHARGING', description: 'DC Fast Charging - Bollinger B1' },
  { amount: 260, source: 'CHARGING', description: 'Standard AC Charging - Workhorse W-15' },
  { amount: 280, source: 'CHARGING', description: 'DC Fast Charging - Atlis XT' },
  { amount: 300, source: 'CHARGING', description: 'AC Fast Charging - Lordstown Endurance' },
  { amount: 320, source: 'CHARGING', description: 'DC Fast Charging - Canoo Lifestyle Vehicle' },
  { amount: 240, source: 'CHARGING', description: 'Standard AC Charging - Faraday Future FF 91' },
  { amount: 260, source: 'CHARGING', description: 'DC Fast Charging - Karma GS-6' },
  { amount: 280, source: 'CHARGING', description: 'AC Fast Charging - VinFast VF 9' },
  { amount: 300, source: 'CHARGING', description: 'DC Fast Charging - Lightship L1' },
  { amount: 220, source: 'CHARGING', description: 'Standard AC Charging - Arrival Van' },
  { amount: 240, source: 'CHARGING', description: 'DC Fast Charging - Nikola Tre BEV' },
  { amount: 260, source: 'CHARGING', description: 'AC Fast Charging - Nikola Tre FCEV' },
  { amount: 280, source: 'CHARGING', description: 'DC Fast Charging - Hyzon XL' },
  { amount: 200, source: 'CHARGING', description: 'Standard AC Charging - Orange EV Terminal Tractor' },
  { amount: 220, source: 'CHARGING', description: 'DC Fast Charging - Proterra ZX5' },
  { amount: 240, source: 'CHARGING', description: 'AC Fast Charging - Gillig Low Floor Plus' },
  { amount: 260, source: 'CHARGING', description: 'DC Fast Charging - New Flyer Xcelsior Charge NG' },
  { amount: 180, source: 'CHARGING', description: 'Standard AC Charging - BYD K9M' },
  { amount: 200, source: 'CHARGING', description: 'DC Fast Charging - Yutong E12' },
  { amount: 220, source: 'CHARGING', description: 'AC Fast Charging - Kinglong XMQ6106' },
  { amount: 240, source: 'CHARGING', description: 'DC Fast Charging - Higer KLQ6109' },
  { amount: 160, source: 'CHARGING', description: 'Standard AC Charging - Zhongtong Bus' },
  { amount: 180, source: 'CHARGING', description: 'DC Fast Charging - Sunwin Bus' },
  { amount: 200, source: 'CHARGING', description: 'AC Fast Charging - Foton Bus' },
  { amount: 220, source: 'CHARGING', description: 'DC Fast Charging - Yutong Bus' },
  { amount: 140, source: 'CHARGING', description: 'Standard AC Charging - Kinglong Bus' },
  { amount: 160, source: 'CHARGING', description: 'DC Fast Charging - Higer Bus' },
  { amount: 180, source: 'CHARGING', description: 'AC Fast Charging - Zhongtong Bus' },
  { amount: 200, source: 'CHARGING', description: 'DC Fast Charging - Sunwin Bus' },
  { amount: 120, source: 'CHARGING', description: 'Standard AC Charging - Foton Bus' },
  { amount: 140, source: 'CHARGING', description: 'DC Fast Charging - Yutong Bus' },
  { amount: 160, source: 'CHARGING', description: 'AC Fast Charging - Kinglong Bus' },
  { amount: 180, source: 'CHARGING', description: 'DC Fast Charging - Higer Bus' },
  { amount: 100, source: 'CHARGING', description: 'Standard AC Charging - Zhongtong Bus' },
  { amount: 120, source: 'CHARGING', description: 'DC Fast Charging - Sunwin Bus' },
  { amount: 140, source: 'CHARGING', description: 'AC Fast Charging - Foton Bus' },
  { amount: 160, source: 'CHARGING', description: 'DC Fast Charging - Yutong Bus' },
  { amount: 80, source: 'CHARGING', description: 'Standard AC Charging - Kinglong Bus' },
  { amount: 100, source: 'CHARGING', description: 'DC Fast Charging - Higer Bus' },
  { amount: 120, source: 'CHARGING', description: 'AC Fast Charging - Zhongtong Bus' },
  { amount: 140, source: 'CHARGING', description: 'DC Fast Charging - Sunwin Bus' },
  { amount: 60, source: 'CHARGING', description: 'Standard AC Charging - Foton Bus' },
  { amount: 80, source: 'CHARGING', description: 'DC Fast Charging - Yutong Bus' },
  { amount: 100, source: 'CHARGING', description: 'AC Fast Charging - Kinglong Bus' },
  { amount: 120, source: 'CHARGING', description: 'DC Fast Charging - Higer Bus' },
  { amount: 40, source: 'CHARGING', description: 'Standard AC Charging - Zhongtong Bus' },
  { amount: 60, source: 'CHARGING', description: 'DC Fast Charging - Sunwin Bus' },
  { amount: 80, source: 'CHARGING', description: 'AC Fast Charging - Foton Bus' },
  { amount: 100, source: 'CHARGING', description: 'DC Fast Charging - Yutong Bus' },
  { amount: 20, source: 'CHARGING', description: 'Standard AC Charging - Kinglong Bus' },
  { amount: 40, source: 'CHARGING', description: 'DC Fast Charging - Higer Bus' },
  { amount: 60, source: 'CHARGING', description: 'AC Fast Charging - Zhongtong Bus' },
  { amount: 80, source: 'CHARGING', description: 'DC Fast Charging - Sunwin Bus' },
  { amount: 200, source: 'WALLET', description: 'Wallet Top-up - Refund' },
  { amount: 150, source: 'WALLET', description: 'Wallet Top-up - Credit' },
  { amount: 300, source: 'WALLET', description: 'Wallet Top-up - Promotion' },
  { amount: 250, source: 'WALLET', description: 'Wallet Top-up - Reward' },
  { amount: 180, source: 'WALLET', description: 'Wallet Top-up - Cashback' },
  { amount: 220, source: 'WALLET', description: 'Wallet Top-up - Incentive' },
  { amount: 160, source: 'WALLET', description: 'Wallet Top-up - Bonus Points' },
  { amount: 280, source: 'WALLET', description: 'Wallet Top-up - Referral Bonus' },
  { amount: 190, source: 'WALLET', description: 'Wallet Top-up - Welcome Bonus' },
  { amount: 210, source: 'WALLET', description: 'Wallet Top-up - Loyalty Reward' },
  { amount: 170, source: 'WALLET', description: 'Wallet Top-up - Anniversary Bonus' },
  { amount: 230, source: 'WALLET', description: 'Wallet Top-up - Milestone Reward' },
  { amount: 150, source: 'WALLET', description: 'Wallet Top-up - Festival Bonus' },
  { amount: 260, source: 'WALLET', description: 'Wallet Top-up - Special Offer' },
  { amount: 140, source: 'WALLET', description: 'Wallet Top-up - Discount Credit' },
  { amount: 270, source: 'WALLET', description: 'Wallet Top-up - Partner Reward' },
  { amount: 130, source: 'WALLET', description: 'Wallet Top-up - VIP Bonus' },
  { amount: 240, source: 'WALLET', description: 'Wallet Top-up - Elite Reward' },
  { amount: 120, source: 'WALLET', description: 'Wallet Top-up - Premium Credit' },
  { amount: 250, source: 'WALLET', description: 'Wallet Top-up - Exclusive Bonus' },
  { amount: 110, source: 'WALLET', description: 'Wallet Top-up - Member Reward' },
  { amount: 220, source: 'WALLET', description: 'Wallet Top-up - Status Bonus' },
  { amount: 100, source: 'WALLET', description: 'Wallet Top-up - Achievement Reward' },
  { amount: 200, source: 'WALLET', description: 'Wallet Top-up - Performance Bonus' },
  { amount: 90, source: 'WALLET', description: 'Wallet Top-up - Recognition Credit' },
  { amount: 180, source: 'WALLET', description: 'Wallet Top-up - Excellence Award' },
  { amount: 80, source: 'WALLET', description: 'Wallet Top-up - Quality Bonus' },
  { amount: 160, source: 'WALLET', description: 'Wallet Top-up - Service Reward' },
  { amount: 70, source: 'WALLET', description: 'Wallet Top-up - Customer Credit' },
  { amount: 140, source: 'WALLET', description: 'Wallet Top-up - Satisfaction Bonus' },
  { amount: 60, source: 'WALLET', description: 'Wallet Top-up - Feedback Reward' },
  { amount: 120, source: 'WALLET', description: 'Wallet Top-up - Review Credit' },
  { amount: 50, source: 'WALLET', description: 'Wallet Top-up - Rating Bonus' },
  { amount: 100, source: 'WALLET', description: 'Wallet Top-up - Testimonial Credit' },
  { amount: 40, source: 'WALLET', description: 'Wallet Top-up - Referral Commission' },
  { amount: 80, source: 'WALLET', description: 'Wallet Top-up - Affiliate Reward' },
  { amount: 30, source: 'WALLET', description: 'Wallet Top-up - Partnership Credit' },
  { amount: 60, source: 'WALLET', description: 'Wallet Top-up - Collaboration Bonus' },
  { amount: 20, source: 'WALLET', description: 'Wallet Top-up - Network Reward' },
  { amount: 40, source: 'WALLET', description: 'Wallet Top-up - Community Credit' },
  { amount: 10, source: 'WALLET', description: 'Wallet Top-up - Social Bonus' },
  { amount: 20, source: 'WALLET', description: 'Wallet Top-up - Engagement Credit' },
  { amount: 30, source: 'WALLET', description: 'Wallet Top-up - Interaction Reward' },
  { amount: 10, source: 'WALLET', description: 'Wallet Top-up - Participation Credit' },
  { amount: 20, source: 'WALLET', description: 'Wallet Top-up - Activity Bonus' },
  { amount: 5, source: 'WALLET', description: 'Wallet Top-up - Event Credit' },
  { amount: 10, source: 'WALLET', description: 'Wallet Top-up - Contest Reward' },
  { amount: 15, source: 'WALLET', description: 'Wallet Top-up - Competition Credit' },
  { amount: 5, source: 'WALLET', description: 'Wallet Top-up - Challenge Bonus' },
  { amount: 10, source: 'WALLET', description: 'Wallet Top-up - Quest Reward' },
  { amount: 3, source: 'WALLET', description: 'Wallet Top-up - Achievement Credit' },
  { amount: 5, source: 'WALLET', description: 'Wallet Top-up - Milestone Bonus' },
  { amount: 2, source: 'WALLET', description: 'Wallet Top-up - Level Reward' },
  { amount: 3, source: 'WALLET', description: 'Wallet Top-up - Progress Credit' },
  { amount: 1, source: 'WALLET', description: 'Wallet Top-up - Growth Bonus' },
  { amount: 2, source: 'WALLET', description: 'Wallet Top-up - Development Credit' },
  { amount: 1, source: 'WALLET', description: 'Wallet Top-up - Learning Reward' },
  { amount: 0, source: 'WALLET', description: 'Wallet Top-up - Training Credit' }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chargeflow');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Charger.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing chargers and transactions');

    // Insert sample chargers
    const insertedChargers = await Charger.insertMany(sampleChargers);
    console.log(`Inserted ${insertedChargers.length} sample chargers:`);
    
    insertedChargers.forEach((charger, index) => {
      console.log(`${index + 1}. ${charger.name} - ${charger.status} (${charger.power}kW)`);
    });

    // Insert sample transactions with varied dates
    const transactions = sampleTransactions.map((transaction, index) => {
      const daysAgo = Math.floor(index / 3); // Spread transactions over time
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      
      return {
        ...transaction,
        createdAt,
        updatedAt: createdAt
      };
    });

    await Transaction.insertMany(transactions);
    console.log(`Inserted ${transactions.length} sample transactions`);

    // Get charger statistics
    const chargerStats = await Charger.getStatistics();
    console.log('\n📊 Charger Statistics:');
    console.log(`Total Chargers: ${chargerStats.totalChargers}`);
    console.log(`Active Chargers: ${chargerStats.activeChargers}`);
    console.log(`Offline Chargers: ${chargerStats.offlineChargers}`);
    console.log(`Maintenance Chargers: ${chargerStats.maintenanceChargers}`);
    console.log(`Total Sessions: ${chargerStats.totalSessions}`);
    console.log(`Average Utilization: ${chargerStats.averageUtilization.toFixed(1)}%`);

    // Get transaction statistics
    const transactionStats = await Transaction.getStatistics();
    console.log('\n💰 Transaction Statistics:');
    console.log(`Total Revenue: ₹${transactionStats.grandTotal.toLocaleString('en-IN')}`);
    console.log(`Total Transactions: ${transactionStats.grandCount}`);
    
    transactionStats.sources.forEach(source => {
      console.log(`${source.source}: ₹${source.total.toLocaleString('en-IN')} (${source.count} transactions)`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();
