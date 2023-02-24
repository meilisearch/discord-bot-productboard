// Execute code when the "ready" client event is triggered.
// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import fetch from "node-fetch";

// Token from Railway Env Variable.
const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});
// When someone react to a message with a :productboard: emoji,
// take the message and the user info, and create a new insight on ProductBoard.
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }

  // check if the reaction is a :productboard: emoji
  if (reaction.emoji.name === "productboard") {
    // get the message author name
    const messageAuthor = reaction.message.author.username;
    // get the message content
    const messageContent = reaction.message.content;
    // get the message url (to be used as the insight link)
    const messageUrl = reaction.message.url;
    // get the message channel name
    const messageChannel = reaction.message.channel.name;

    // Send the information to ProductBoard
    const response = await fetch("https://api.productboard.com/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PRODUCTBOARD_TOKEN}`,
      },
      body: JSON.stringify({
        title: `Insight from Discord - ${messageChannel}`,
        content: messageContent,
        display_url: messageUrl,
        user: {
          external_id: messageAuthor,
        },
        source: {
          origin: "Discord",
          record_id: messageUrl,
        },
        tags: ["from: discord"],
      }),
    });
    // log the response
    console.log(response.status);
  }
});

// Log in to Discord with your client's token
client.login(token);
