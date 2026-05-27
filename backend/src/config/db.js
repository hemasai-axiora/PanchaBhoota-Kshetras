const mongoose = require('mongoose');
const fileDb = require('./fileDb');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    console.log('[Database System] Attempting standard connection to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/panchabhoota', {
      serverSelectionTimeoutMS: 3000 // Timeout quickly if MongoDB is offline
    });
    console.log(`[Database System] MongoDB Connected: ${conn.connection.host}`);
    fileDb.setUseFileDb(false);
  } catch (error) {
    console.warn(`[Database System] MongoDB connection failed: ${error.message}`);
    console.log('[Database System] FALLING BACK TO LOCAL FILE-BASED JSON DATABASE 📁');
    
    // Enable the file database fallback
    fileDb.setUseFileDb(true);

    // Auto-seed JSON files on the fly if empty
    autoSeedFileDb();
  }
};

const autoSeedFileDb = async () => {
  try {
    const templesFile = path.join(__dirname, '../data/temples.json');
    const adminsFile = path.join(__dirname, '../data/admins.json');

    // 1. Seed Temples if empty
    if (!fs.existsSync(templesFile) || fs.readFileSync(templesFile, 'utf8').trim() === '[]' || fs.readFileSync(templesFile, 'utf8').trim() === '') {
      console.log('[Auto-Seeding] Seed data not found. Populating temples.json...');
      
      const templesData = [
        {
          name: 'Ekambareswarar Temple',
          element: 'Earth',
          elementSanskrit: 'Prithvi',
          deity: 'Lord Ekambareswarar (worshiped as Prithvi Lingam)',
          consort: 'Goddess Elavaruzhalumai (Kamakshi Amman)',
          location: 'Kanchipuram',
          state: 'Tamil Nadu',
          description: 'Ekambareswarar Temple is a magnificent Hindu temple dedicated to Lord Shiva, representing the Earth element (Prithvi) of the five elements. Spread over 25 acres, it is one of the largest temple complexes in India, famous for its grand 59-meter tall Southern Gopuram and a sacred 3,500-year-old mango tree whose four branches yield four different tastes of mangoes, representing the four Vedas.',
          history: 'The temple dates back to the Pallava dynasty (6th century) and was later expanded by the Cholas and Vijayanagara kings. Legend says Goddess Parvati performed penance under a mango tree here, creating a Shiva Lingam out of sand. To test her devotion, Lord Shiva flooded the area. Parvati hugged the Lingam tightly to save it from washing away, leaving the marks of her bangles and bosom on the sandy Lingam. Pleased with her deep devotion, Shiva appeared and wed her, becoming Ekambareswarar (Lord of the Single Mango Tree).',
          powers: [
            'Grants stability, groundedness, and mental strength to seekers.',
            'Aids in career growth, material stability, and overcoming property disputes.',
            'Blesses childless couples with offspring through prayers under the sacred Mango Tree.',
            'Helps in releasing karmic blockages related to family and ancestors.'
          ],
          timings: {
            morning: '6:00 AM - 12:30 PM',
            evening: '4:00 PM - 8:30 PM'
          },
          festivals: [
            'Panguni Uthiram (March-April) - The grand 13-day wedding festival',
            'Maha Shivaratri (February-March)',
            'Pradosham (Every fortnight)'
          ],
          images: [
            'https://images.unsplash.com/photo-1600100397608-f010e4785465?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1608958416719-74f07a72661f?auto=format&fit=crop&w=800&q=80'
          ],
          coordinates: {
            latitude: 12.8465,
            longitude: 79.6998
          },
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3890.3541571407335!2d79.69761131482035!3d12.846499991003666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52c3b88939c361%3A0xe54b9f298ea1de!2sArulmigu%20Ekambareswarar%20Temple!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin',
          featured: true
        },
        {
          name: 'Jambukeswarar Temple',
          element: 'Water',
          elementSanskrit: 'Appu',
          deity: 'Lord Jambukeswarar (worshiped as Appu Lingam)',
          consort: 'Goddess Akhilandeswari Amman',
          location: 'Thiruvanaikaval, Srirangam',
          state: 'Tamil Nadu',
          description: 'Jambukeswarar Temple, representing the Water element (Appu), is located on Srirangam island. The sanctum of the temple houses an underground water spring which constantly bubbles up and keeps the Lingam moist, even during dry seasons. The goddess Akhilandeswari is highly revered here, and the priests perform the noon puja dressed in sarees, enacting the goddess worshiping Lord Shiva.',
          history: 'Constructed by Kocengannan, an early Chola king, more than 1,800 years ago, the temple is rich with legends. An elephant and a spider once worshiped the Shiva Lingam under a Jambu tree. The spider spun a web over the Lingam to protect it from falling leaves, while the elephant brought river water to wash the Lingam, breaking the web. Angered, the spider crawled into the elephant\'s trunk and bit it; both died from the encounter. Pleased by their devotion, Shiva blessed both, reincarnating the spider as a Chola King who built 70 temples where elephants could not enter (hence the narrow sanctums of Chola temples).',
          powers: [
            'Purifies body and mind, washing away inner impurities and toxic emotions.',
            'Enhances creativity, emotional intelligence, and artistic abilities.',
            'Worship of Akhilandeswari bestows ultimate wisdom, education, and speech power.',
            'Soothes hot tempers and promotes peaceful relationships.'
          ],
          timings: {
            morning: '5:30 AM - 1:00 PM',
            evening: '3:00 PM - 8:30 PM'
          },
          festivals: [
            'Panguni Brahmostavam (March-April)',
            'Aadi Pooram (July-August)',
            'Thai Poosam (January-February)'
          ],
          images: [
            'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1566371486490-560ded239de6?auto=format&fit=crop&w=800&q=80'
          ],
          coordinates: {
            latitude: 10.8534,
            longitude: 78.7056
          },
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3918.257321526435!2d78.70341131480173!3d10.85339999226922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf58a1835bc45%3A0x6b7fa1f2ff23efad!2sJambukeswarar%20Temple!5e0!3m2!1sen!2sin!4v1680000000001!5m2!1sen!2sin',
          featured: true
        },
        {
          name: 'Arunachaleswarar Temple',
          element: 'Fire',
          elementSanskrit: 'Tejas / Agni',
          deity: 'Lord Arunachaleswarar (Annamalaiyar, worshiped as Agni Lingam)',
          consort: 'Goddess Unnamulai Amman (Apeethakuchambal)',
          location: 'Tiruvannamalai',
          state: 'Tamil Nadu',
          description: 'Arunachaleswarar Temple, representing the Fire element (Agni), is nestled at the base of the sacred Arunachala Hill, which is believed to be Shiva himself in the form of a column of fire. The temple is one of the largest in the world, stretching over 24 acres. Every full moon, millions of pilgrims perform Giri Pradakshina, walking bare-footed around the 14km circumference of the hill to attain spiritual liberation.',
          history: 'The temple boasts ancient origins, with structural expansions from the Chola, Vijayanagara, and Nayak dynasties. According to legend, Lord Brahma (the Creator) and Lord Vishnu (the Preserver) argued over who was superior. To resolve the dispute, Lord Shiva appeared as a boundless, blinding pillar of fire (Arunachala) and challenged them to find its source or end. Vishnu became a boar and dug into the earth, while Brahma became a swan and flew skyward; both failed. They humbled themselves, realizing Shiva\'s infinite nature.',
          powers: [
            'Ignites the fire of spiritual wisdom (Jnana) and burns away ego and ignorance.',
            'Grants inner transformation, courage, and vitality.',
            'Helps in releasing intense fears, bad habits, and chronic physical lethargy.',
            'Giri Pradakshina on full moon days resolves deep planetary blockages and heals illnesses.'
          ],
          timings: {
            morning: '5:00 AM - 12:30 PM',
            evening: '3:30 PM - 9:30 PM'
          },
          festivals: [
            'Karthigai Deepam (November-December) - A massive beacon of fire is lit atop the sacred hill',
            'Chitra Pournami (April-May)',
            'Maha Shivaratri (February-March)'
          ],
          images: [
            'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1621274790572-7c325d6bc67f?auto=format&fit=crop&w=800&q=80'
          ],
          coordinates: {
            latitude: 12.2319,
            longitude: 79.0676
          },
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.4339891001416!2d79.06541131481561!3d12.231899991256334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3abb136a8d8a7c29%3A0xb30e37b988f01c69!2sArulmigu%20Arunachaleswarar%20Temple!5e0!3m2!1sen!2sin!4v1680000000002!5m2!1sen!2sin',
          featured: true
        },
        {
          name: 'Sri Kalahasti Temple',
          element: 'Air',
          elementSanskrit: 'Vayu',
          deity: 'Lord Sri Kalahasteeswara (worshiped as Vayu Lingam)',
          consort: 'Goddess Gnanaprasunambika Devi',
          location: 'Srikalahasti',
          state: 'Andhra Pradesh',
          description: 'Sri Kalahasti Temple is a renowned temple representing the Air element (Vayu) and is located on the banks of the Swarnamukhi River. In the inner sanctum, there is a flickering lamp placed next to the main stone Lingam that constantly wavers, indicating the unseen presence of Vayu (Air), despite there being no ventilation in the enclosed stone chamber. It is also famous globally as the premier Rahu-Ketu Sarpa Dosha Nivarana temple.',
          history: 'The temple was originally constructed by Pallava kings and later developed extensively by Chola and Vijayanagara emperors, particularly King Krishnadevaraya. The name originates from three devotees: Sri (Spider), Kala (Serpent), and Hasti (Elephant). The spider spun webs to protect the Lingam, the snake placed precious gems, and the elephant washed the Lingam with water. In their competitive devotion, they clashed, but Lord Shiva blessed all three with liberation, naming the temple in their combined honor.',
          powers: [
            'Alleviates the astrological afflictions of Rahu, Ketu, and Sarpa Dosha.',
            'Brings deep breath control, calms anxious minds, and cures respiratory issues.',
            'Bestows name, fame, and sharp intellect through Goddess Gnanaprasunambika.',
            'Helps in releasing emotional burdens, depression, and mental heavy-heartedness.'
          ],
          timings: {
            morning: '6:00 AM - 12:00 PM',
            evening: '4:00 PM - 9:00 PM'
          },
          festivals: [
            'Maha Shivaratri Brahmotsavams (February-March) - 13 days of grand celebrations',
            'Nandi Seva',
            'Karthika Masam (October-November)'
          ],
          images: [
            'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1616038242814-a6eac7845d88?auto=format&fit=crop&w=800&q=80'
          ],
          coordinates: {
            latitude: 13.7498,
            longitude: 79.6983
          },
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3882.355152062365!2d79.69611131482596!3d13.74979999158652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4d3b6f00000001%3A0xc4eb789c0ea4fa98!2sSri%20Kalahasteeswara%20Swami%20Temple!5e0!3m2!1sen!2sin!4v1680000000003!5m2!1sen!2sin',
          featured: true
        },
        {
          name: 'Chidambaram Nataraja Temple',
          element: 'Space',
          elementSanskrit: 'Akasha',
          deity: 'Lord Nataraja (Lord of Dance, worshiped as Akasha Lingam / Chidambara Rahasya)',
          consort: 'Goddess Shivagami Amman',
          location: 'Chidambaram',
          state: 'Tamil Nadu',
          description: 'Chidambaram Nataraja Temple represents the Space element (Akasha), the subtlest of the five elements. Unlike other Shiva temples, Shiva is worshiped here not as a physical stone Lingam, but in three forms: as the cosmic dancer Nataraja, as an empty space behind a golden curtain (representing the ultimate formlessness - Chidambara Rahasya), and as a crystal Lingam. The temple architecture is mathematically symbolic, representing the human body with 21,600 golden roof tiles representing daily human breaths.',
          history: 'Dating back to the Chola era, this temple has been a spiritual hub for millennia. Lord Shiva, in the form of a handsome mendicant, came to the Pine Forests of Darukavana to humble the arrogant sages who believed in rituals over devotion. Realizing their folly, the sages bowed down. Shiva then performed the cosmic dance of bliss (Ananda Tandava) to please his devotees Patanjali and Vyaghrapada, revealing that the ultimate reality is infinite, divine space, residing right inside the human heart.',
          powers: [
            'Expands consciousness, connecting the seeker to the infinite cosmic field.',
            'Clears mental clutter, deepens meditation, and aligns the heart-space.',
            'Blesses devotees with excellence in classical arts, music, dance, and spiritual growth.',
            'Assists in overcoming fear of death and understanding the impermanence of the physical world.'
          ],
          timings: {
            morning: '6:00 AM - 12:00 PM',
            evening: '5:00 PM - 10:00 PM'
          },
          festivals: [
            'Marghazhi Thiruvaadhirai (December-January) - Grand Chariot and Abhishekam',
            'Aani Thirumanjanam (June-July)',
            'Natyanjali Dance Festival (February-March) - Gathering of classical dancers'
          ],
          images: [
            'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
          ],
          coordinates: {
            latitude: 11.3994,
            longitude: 79.6933
          },
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.3541571407335!2d79.69111131482035!3d11.399399991003666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a54c30c88dbbeab%3A0xb3de37b988f01c69!2sThillai%20Nataraja%20Temple!5e0!3m2!1sen!2sin!4v1680000000004!5m2!1sen!2sin',
          featured: true
        }
      ];

      fileDb.deleteMany('temples');
      fileDb.insertMany('temples', templesData);
      console.log('[Auto-Seeding] Temples data successfully auto-seeded to local storage!');
    }

    // 2. Seed Admin if empty
    if (!fs.existsSync(adminsFile) || fs.readFileSync(adminsFile, 'utf8').trim() === '[]' || fs.readFileSync(adminsFile, 'utf8').trim() === '') {
      console.log('[Auto-Seeding] Admin credentials not found. Populating admins.json...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Shiva@108', salt);

      const adminsData = [
        {
          username: 'ShivaAdmin',
          email: 'admin@panchabhoota.org',
          password: hashedPassword,
          role: 'Admin'
        }
      ];
      fileDb.deleteMany('admins');
      fileDb.insertMany('admins', adminsData);
      console.log('[Auto-Seeding] Default Admin credentials auto-seeded successfully!');
    }
  } catch (err) {
    console.error('[Auto-Seeding Error] Failed to populate local files:', err);
  }
};

module.exports = connectDB;
