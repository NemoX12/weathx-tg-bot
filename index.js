const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

const bot = new Telegraf(`${process.env.BOT_TOKEN}`);
bot.start((ctx) => {
  const welcomeMessage = `Welcome ${ctx.chat.first_name}!\nTo start using, Write City Name (in english)\nType /help to see more info`;

  ctx.reply(welcomeMessage);
});

bot.help((cxt) => {
  const msg = `This bot is under MIT License.\nTo start using just type city name\nIf you encountered bugs DM me @neemox\nVersion: 0.1.0`;

  cxt.reply(msg);
});

bot.on("message", async (ctx) => {
  const regex = /^[a-z\s]+$/;
  const city_name = ctx.message.text.toLowerCase();
  const reTest = regex.test(city_name);

  if (reTest && city_name) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${process.env.WEATHER_API}`;
      const request = await axios.get(url);

      const temp = Math.round(request.data.main.temp - 273.15);

      ctx.replyWithDocument(
        { source: "assets/caption.gif" },
        {
          caption: `Location: ${request.data.name}, ${request.data.sys.country}\nDescription: ${request.data.weather[0].main}\nTemp: ${temp}°C\nHumidity: ${request.data.main.humidity}%`,
        }
      );
      console.log(request);
    } catch (error) {
      console.log(error);
      ctx.reply("Enter Valid City...");
    }
  }
});

bot
  .launch()
  .then(() => {
    console.log("Bot has started");
  })
  .catch((err) => {
    console.error("Error starting bot", err);
  });

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
