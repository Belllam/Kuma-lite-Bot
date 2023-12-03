import { Client, GatewayIntentBits } from "discord.js";
import express from "express";
import dotenv from "dotenv";
import { registerCommands } from "./routes/route.js";
import {
  handleRandomAnimeCommand,
  handleSearchAnimeCommand,
} from "./commands/anime.js";
import {
  handleRandomMangaCommand,
  handleSearchMangaCommand,
} from "./commands/manga.js";
import { handleRankCommand } from "./commands/rank.js";
import { handleHelpCommand } from "./commands/help.js";
import { handleWebtoonDownloadCommand } from "./commands/download_webtoon.js";
import { handleWebtoonListCommand } from "./commands/webtoon.js";

const app = express();
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(3000, () => console.log("Server is running..."));

// load env variables
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// load registered commands
registerCommands(client, process.env.CLIENT_ID);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  switch (interaction.commandName) {
    case "randomanime":
      await handleRandomAnimeCommand(interaction);
      break;
    case "searchanime":
      await handleSearchAnimeCommand(interaction);
      break;
    case "randommanga":
      await handleRandomMangaCommand(interaction);
      break;
    case "searchmanga":
      await handleSearchMangaCommand(interaction);
      break;
    case "rank":
      await handleRankCommand(interaction);
      break;
    case "help":
      await handleHelpCommand(interaction);
      break;
    case "webtoonDownload":
      await handleWebtoonDownloadCommand(interaction);
      break;
    case "webtoonList":
      await handleWebtoonListCommand(interaction);
      break;
    default:
      break;
  }
});

client.login(process.env.TOKEN);
