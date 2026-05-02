const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../database.json');

/**
 * A very simple file-based storage for when MongoDB is offline.
 * This ensures the app works "out of the box" for the user.
 */
class LocalStorage {
  constructor() {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
    }
  }

  getData() {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  }

  saveData(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  }

  async findUserByEmail(email) {
    const data = this.getData();
    return data.users.find(u => u.email === email);
  }

  async findUserBySessionId(sessionId) {
    const data = this.getData();
    return data.users.find(u => u.sessionId === sessionId);
  }

  async saveUser(user) {
    const data = this.getData();
    const index = data.users.findIndex(u => u.sessionId === user.sessionId);
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...user };
    } else {
      data.users.push(user);
    }
    this.saveData(data);
    return user;
  }
}

module.exports = new LocalStorage();
