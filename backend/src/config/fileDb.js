const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection) => {
  const file = getFilePath(collection);
  if (!fs.existsSync(file)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeData = (collection, data) => {
  const file = getFilePath(collection);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

let useFileDb = false;

module.exports = {
  setUseFileDb: (val) => { 
    useFileDb = val; 
    console.log(`[Database System] Active Database Mode: ${val ? 'LOCAL JSON FILE FALLBACK 📁' : 'MONGODB DATABASE 🛢️'}`);
  },
  isUsingFileDb: () => useFileDb,
  
  find: (collection, query = {}) => {
    let list = readData(collection);
    // element filter
    if (query.element && query.element !== 'All') {
      list = list.filter(item => item.element.toLowerCase() === query.element.toLowerCase());
    }
    // search filter
    if (query.search) {
      const q = query.search.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.deity && item.deity.toLowerCase().includes(q)) ||
        (item.elementSanskrit && item.elementSanskrit.toLowerCase().includes(q))
      );
    }
    return list;
  },
  
  findById: (collection, id) => {
    const list = readData(collection);
    return list.find(item => item._id === id);
  },
  
  findOne: (collection, query = {}) => {
    const list = readData(collection);
    return list.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  },
  
  create: (collection, doc) => {
    const list = readData(collection);
    const newDoc = {
      _id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      ...doc
    };
    list.push(newDoc);
    writeData(collection, list);
    return newDoc;
  },
  
  findByIdAndUpdate: (collection, id, updateData) => {
    const list = readData(collection);
    const idx = list.findIndex(item => item._id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updateData };
    writeData(collection, list);
    return list[idx];
  },
  
  findByIdAndDelete: (collection, id) => {
    let list = readData(collection);
    const exists = list.some(item => item._id === id);
    if (!exists) return false;
    list = list.filter(item => item._id !== id);
    writeData(collection, list);
    return true;
  },

  deleteMany: (collection) => {
    writeData(collection, []);
  },

  insertMany: (collection, docs) => {
    const list = readData(collection);
    const seeded = docs.map(d => ({
      _id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      ...d
    }));
    const combined = [...list, ...seeded];
    writeData(collection, combined);
    return seeded;
  }
};
