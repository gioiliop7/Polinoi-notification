# Polynoe-notification
### Telegram bot - Polynoe notification
A telegram bot that notificates you when your thesis to Polynoe (https://polynoe.lib.uniwa.gr/xmlui/).

## How to run
- Create a telegram bot to get a token (https://learn.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-telegram?view=azure-bot-service-4.0)
- Run the command: git pull
- Create a env file 
`RSS_FEED_URL=https://polynoe.lib.uniwa.gr/xmlui/feed/rss_2.0/11400/16 (Example of Department of Wine, Vine & Beverage Sciences)
BOT_TOKEN="Your telegram Bot token"
GIVEN_STRING=One string to search in content (As an example your name)`
- Run docker-compose up or docker compose up to build  the app
