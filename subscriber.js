const sqlite3 = require("sqlite3").verbose();

class Subscriber {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Connected to the subscribers database.");
      }
    });

    this.db.run(
      "CREATE TABLE IF NOT EXISTS subscribers (id INTEGER PRIMARY KEY,is_send BOOLEAN DEFAULT 0)"
    );
  }

  async getSubscribers() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT id,is_send FROM subscribers", (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async addSubscriber(id) {
    return new Promise((resolve, reject) => {
      this.db.run("INSERT INTO subscribers (id) VALUES (?)", id, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async removeSubscriber(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM subscribers WHERE id=?", id, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async isSubscribed(id) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT id FROM subscribers WHERE id=?", id, (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      });
    });
  }

  async updateIsSend(id) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE subscribers SET is_send = 1 WHERE id = ?",
        id,
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }
}

module.exports = Subscriber;
