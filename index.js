require("dotenv").config();
const { Telegraf } = require("telegraf");
const Parser = require("rss-parser");

const bot = new Telegraf(process.env.BOT_TOKEN);
const parser = new Parser();

// Create an array to hold the chat IDs of subscribed users
const subscribers = [];

bot.start((ctx) => {
  ctx.reply("Send /subscribe to receive updates from the RSS feed.");
  //   await checkForUpdates();
});

bot.command("subscribe", (ctx) => {
  // Add the user's chat ID to the subscribers array
  subscribers.push(ctx.chat.id);

  // Log the subscribers
  console.log("Subscribers:", subscribers);

  ctx.reply("You have subscribed to updates from the RSS feed.");
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

let previousItem;

// Check for updates every 5 minutes
setInterval(checkForUpdates, 1 * 60 * 1000);

// Start the bot and listen for messages
bot.launch();
console.log("Bot is running...");
