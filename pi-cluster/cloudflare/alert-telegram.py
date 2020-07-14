from telethon.sync import TelegramClient as Client
import os
import sys

message=sys.argv[1]
api_id=os.getenv("telegram_api_id")
api_hash=os.getenv("telegram_api_hash")
bot_token=os.getenv("telegram_api_token")


bot=Client("bot",api_id,api_hash).start(bot_token=bot_token)

bot.send_message("madinzg",message)
