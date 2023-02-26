
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
- Create a file `{project_root}/db/subscribers.db`
- Run docker-compose up or docker compose up to build  the app
## Available commands
- /subscribe -> Subscribes to the list in order to get the updates
- /unsubscribe -> Deletes your id from the list of id's that will be updated when a thesis is uploaded
