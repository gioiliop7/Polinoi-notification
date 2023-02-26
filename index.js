require("dotenv").config();
const { Telegraf } = require("telegraf");
const Parser = require("rss-parser");
const path = require("path");
const dbPath = path.join(__dirname, "db", "subscribers.db");
console.log(dbPath);

const bot = new Telegraf(process.env.BOT_TOKEN);
const parser = new Parser();
const Subscriber = require("./subscriber");

const subscriber = new Subscriber(dbPath);

// Create the subscribers array
let subscribers = [];

bot.start((ctx) => {
  ctx.reply("Send /subscribe to receive updates from the RSS feed.");
  //   await checkForUpdates();
});

// Define the 'subscribe' command
bot.command("subscribe", async (ctx) => {
  // Get the chat ID
  const chatId = ctx.chat.id;

  // Check if the user is already subscribed
  const isSubscribed = await subscriber.isSubscribed(chatId);
  if (isSubscribed) {
    ctx.reply("You are already subscribed!");
    return;
  }

  try {
    await subscriber.addSubscriber(chatId);
    ctx.reply("You have been subscribed!");
  } catch (error) {
    ctx.reply("Something went wrong!");
  }
});

bot.command("unsubscribe", async (ctx) => {
  // Get the chat ID
  const chatId = ctx.chat.id;

  // Check if the user is already subscribed
  const isSubscribed = await subscriber.isSubscribed(chatId);
  if (!isSubscribed) {
    ctx.reply("You are not subscribed!");
    return;
  }

  try {
    await subscriber.removeSubscriber(chatId);
    ctx.reply("You have been unsubscribed!");
  } catch (error) {
    ctx.reply("Something went wrong!");
  }
});


const checkForUpdates = async () => {
  try {
    // Get all subscribers
    subscribers = await subscriber.getSubscribers();

    for (const sub of subscribers) {
      const chatId = sub.id;
      const isSend = sub.is_send;

      // Skip subscribers who have already received the latest

      if (isSend) {
        continue;
      }

      const feed = await parser.parseURL(process.env.RSS_FEED_URL);
      const latestItem = feed.items[0];
      const date = latestItem.date;
      const title = latestItem.title;
      const givenString = process.env.GIVEN_STRING;
      const content = latestItem.content;

      if (content.includes(givenString)) {
        await subscriber.updateIsSend(chatId);
        bot.telegram.sendMessage(chatId, "H Πτυχιακή σου ανέβηκε!");
        bot.telegram.sendMessage(chatId, latestItem.link);
      }
    }

  } catch (error) {
    console.error(error);
  }
};

// Check for updates every 5 minutes
setInterval(checkForUpdates, 300000);

// Start the bot and listen for messages
bot.launch();
console.log("Bot is running...");
