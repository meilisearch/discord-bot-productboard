// Execute code when the "ready" client event is triggered.
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");

// Token from Railway Env Variable.
const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
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
    // get the message author
    const messageAuthor = reaction.message.author;
    // get the message content
    const messageContent = reaction.message.content;
    // get the message author email
    const messageAuthorEmail = reaction.message.author.email;
    // log the message author, message content and message author email
    console.log({ messageAuthor, messageContent, messageAuthorEmail });
  }
});

// Log in to Discord with your client's token
client.login(token);
