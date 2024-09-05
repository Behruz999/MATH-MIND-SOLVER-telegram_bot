require("dotenv").config();
// const http = require("http");
const env = process.env;
const express = require("express");
const app = express();
const TelegramBot = require("node-telegram-bot-api");
const token = env.BOT_TOKEN;
const bot = new TelegramBot(token);
const webhookUrl = `${env.SERVER_URL}/${env.WEBHOOK_PATH}`;
const cors = require("cors");
// const server = http.createServer((req, res) => {
//   // Handle CORS
//   res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allowed methods
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allowed headers
//   res.statusCode = 200; // Set HTTP status code to 200 (OK)
//   res.setHeader("Content-Type", "text/plain"); // Set response header
//   res.end("Hello, World!\n"); // Send response
// });

//
// Middleware to parse incoming JSON payloads
app.use(express.json());
app.use(cors());

bot
  .setWebHook(webhookUrl)
  .then((response) => {
    console.log("Webhook set response:", response);
  })
  .catch((error) => {
    console.error("Failed to set webhook:", error.message);
  });

app.post("/webhook", (req, res) => {
  // console.log("Received update:", req.body); // Log incoming updates
  try {
    bot.processUpdate(req.body);
    res.status(200).send("ok");
  } catch (error) {
    console.error("Error processing update:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    const welcomeMessage = `Welcome to Math Solver Bot!

    Ready to challenge your math skills? 🤔✨
    
    Here’s what you can do:
    - **Solve Now:** Click the button below to access a variety of math problems and puzzles.
    - **Let's Get Started:** Configure our math platform settings to make example based on your preferences.
    - **Generate:** After configuring settings, you can now start your journey.
    
    **Get started by clicking the button below!** 🧠🔢`;

    const options = {
      reply_markup: {
        //   keyboard: [
        //     [
        //       {
        //         text: `Go ahead`,
        //         web_app: {
        //           url: `https://math-mind-solver.vercel.app/`,
        //         },
        //       },
        //     ],
        //   ],
        inline_keyboard: [
          [
            {
              text: "Solve Now",
              web_app: {
                url: env.WEB_APP_URL,
              },
              // callback_data: "option_1",
            },
          ],
        ],
      },
    };

    await bot.sendMessage(chatId, welcomeMessage, options);
  } else if (msg?.voice) {
    await bot.sendMessage(chatId, `Bot doesn't interact with voice messages !`);
  } else if (msg?.video_note) {
    await bot.sendMessage(chatId, `Bot doesn't interact with video messages !`);
  } else if (msg.audio) {
    await bot.sendMessage(chatId, `Bot doesn't interact with audio messages !`);
  } else if (msg.contact) {
    await bot.sendMessage(chatId, `Bot doesn't interact with contacts !`);
  } else if (msg.location) {
    await bot.sendMessage(chatId, `Bot doesn't interact with location !`);
  } else if (msg.message_id) {
    await bot.sendMessage(chatId, `Bot doesn't have analysing messages !`);
  } else if (msg.sticker) {
    await bot.sendSticker(chatId, msg.sticker.file_id);
  } else {
    await bot.sendMessage(chatId, `Unsupported interaction`);
  }
});

app.listen(env.PORT, () => {
  console.log(`Server running at ${env.PORT}th port`);
});

// Set the webhook
// const setWebhook = async () => {
//   try {
//     const response = await bot.setWebHook(`${webhookUrl}${env.BOT_TOKEN}`);
//     console.log("Webhook set response:", response);
//   } catch (error) {
//     console.error("Failed to set webhook:", error.message);
//   }
// };

// setWebhook();
