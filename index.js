require("dotenv").config();
const { Telegraf } = require("telegraf");
const Parser = require("rss-parser");
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'db', 'subscribers.db');
console.log(dbPath)

const bot = new Telegraf(process.env.BOT_TOKEN);
const parser = new Parser();
// Open the SQLite database connection
const db = new sqlite3.Database(dbPath);

// Create the 'subscribers' table if it doesn't exist
db.run("CREATE TABLE IF NOT EXISTS subscribers (id INTEGER PRIMARY KEY)");

// Create an array to hold the chat IDs of subscribed users
let subscribers = [];

// Load the subscribers from the database into the array
db.all("SELECT id FROM subscribers", (error, rows) => {
  if (error) {
    console.error(error);
  } else {
    subscribers = rows.map((row) => row.id);
  }
});
bot.start((ctx) => {
  ctx.reply("Send /subscribe to receive updates from the RSS feed.");
  //   await checkForUpdates();
});

// Define the 'subscribe' command
bot.command("subscribe", (ctx) => {
  // Get the chat ID
  const chatId = ctx.chat.id;

  // Check if the user is already subscribed
  if (subscribers.includes(chatId)) {
    ctx.reply("You are already subscribed!");
    return;
  }

  // Add the user to the subscribers array
  subscribers.push(chatId);

  // Add the user to the database
  db.run("INSERT INTO subscribers (id) VALUES (?)", chatId, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Added subscriber ${chatId}`);
    }
  });

  // Send a confirmation message
  ctx.reply("You have been subscribed!");
});

const checkForUpdates = async () => {
  try {
    for (const chatId of subscribers) {
      const chat = await bot.telegram.getChat(chatId);
      console.log(chat);

      const feed = await parser.parseURL(process.env.RSS_FEED_URL);
      const latestItem = feed.items[0];
      const date = latestItem.date;
      const title = latestItem.title;
      const givenString = process.env.GIVEN_STRING;
      const content = latestItem.content;

      // Check if the latest item is different from the previously sent item
      if (content.includes(givenString)) {
        // Send the latest item to all subscribed users

        bot.telegram.sendMessage(chatId, "H Πτυχιακή σου ανέβηκε!");
        bot.telegram.sendMessage(chatId, latestItem.link);
      }
    }
  } catch (error) {
    console.error(error);
  }
};


// Check for updates every 5 minutes
setInterval(checkForUpdates, 1 * 60 * 1000);

// Start the bot and listen for messages
bot.launch();
console.log("Bot is running...");
