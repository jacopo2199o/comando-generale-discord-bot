import fs from "node:fs";
import { argv } from "node:process";
import { Events } from "discord.js";
import { deepFreeze } from "../general-utilities.js";

// switch server to test
const community = (() => {
  const ranks = (() => {
    const jacopo2199o = ((path) => {
      const data = (() => {
        return fs.readFileSync(path);
      })();
      return JSON.parse(data);
    })("./resources/jacopo2199o-ranks.json");
    const comandoGenerale = ((path) => {
      const data = (() => {
        return fs.readFileSync(path);
      })();
      return JSON.parse(data);
    })("./resources/comando-generale-ranks.json");
    return {
      comandoGenerale,
      jacopo2199o
    };
  })();

  if (argv[2] === "-comando generale") {
    return deepFreeze({
      id: process.env.comando_generale_id,
      ranks: ranks.comandoGenerale
    });
  } else if (argv[2] === "-jacopo2199o") {
    return deepFreeze({
      id: process.env.jacopo2199o_id,
      ranks: ranks.jacopo2199o
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