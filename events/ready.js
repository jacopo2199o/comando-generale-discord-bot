import fs from "node:fs";
import { argv } from "node:process";
import { Events } from "discord.js";

// switch server to test
const community = (() => {
  const ranks = (() => {
    const jacopo2199o = ((path) => {
      const data = fs.readFileSync(path);
      return JSON.parse(data);
    })("./resources/jacopo2199o-ranks.json");
    const comandoGenerale = ((path) => {
      const data = fs.readFileSync(path);
      return JSON.parse(data);
    })("./resources/comando-generale-ranks.json");
    return Object.freeze({
      comandoGenerale,
      jacopo2199o
    });
  })();

  if (argv[2] === "-comando generale") {
    return Object.freeze({
      baseRole: ranks.comandoGenerale[ranks.comandoGenerale.length - 1],
      id: process.env.comando_generale_id,
      ranks: ranks.comandoGenerale,
      room: "705692949467496480"
    });
  } else if (argv[2] === "-jacopo2199o") {
    return Object.freeze({
      baseRole: ranks.jacopo2199o[ranks.jacopo2199o.length - 1],
      id: process.env.jacopo2199o_id,
      ranks: ranks.jacopo2199o,
      room: "1100786695613456455"
    });
  } else {
    throw new Error("server name argument must be provided");
  }
})();

const name = Events.ClientReady;
const once = true;
/**
 * @param {import("discord.js").Client} client
 */
const execute = async (client) => {
  console.log(`bot logged in as ${client.user.username}`);
};

export {
  name,
  once,
  community,
  execute
};