import { EmbedBuilder } from "discord.js";
import axios from "axios";

/**
 * handleSearchCommand - search for a webtoon
 * @param {*} interaction
 * @param {*} fetch
 * @returns
 * @see https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor
 */
export async function handleSearchCommand(interaction) {
  const keyword = interaction.options.getString("keyword");
  const maxRetries = 5; // Maximum number of retries

  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await axios.get(
        `https://korea-webtoon-api.herokuapp.com/search?keyword=${keyword}`
      );
      const data = response.data;
      console.log(data);
      if (data.webtoons.length > 0) {
        const firstWebtoon = data.webtoons[0];
        const embed = new EmbedBuilder()
          .setTitle(firstWebtoon.title)
          .setColor(0x0099ff)
          .addFields(
            {
              name: "Author",
              value: firstWebtoon.author || "No author found",
            },
            {
              name: "title",
              value: firstWebtoon.title || "No title found",
            },
            {
              name: "id",
              value:
                String(firstWebtoon.webtoonId).substring(7) || "No id found",
            },
            {
              name: "url",
              value: firstWebtoon.url || "No url found",
            }
          )
          .setImage(firstWebtoon.img)
          .setTimestamp()
          .setFooter({
            text: "Powered by Nomekuma",
            iconURL: "https://avatars.githubusercontent.com/u/122863540?v=4",
          });
        interaction.reply({ embeds: [embed.toJSON()] });
        return; // Exit function after successful response
      } else {
        interaction.reply("No webtoons found for the given keyword.");
        return; // Exit function after replying
      }
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed: ${error.message}`);
      retries++;
    }
  }

  // If all retries fail
  interaction.reply("An error occurred while searching for webtoons.");
}
