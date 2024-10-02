import fs from "node:fs";
import {
  globalPoints,
  reputationPoints,
  seniority
} from "../events/ready.js";

/**
 * @param {import("discord.js").GuildMember} member 
 */
function addMember(
  member
) {
  globalPoints[member.guild.id][member.id] = 0;
  reputationPoints[member.guild.id][member.id] = {
    points: 0,
    gaveTo: ""
  };
  seniority[member.guild.id][member.id] = 0;
  console.log(
    `new member: ${member.id}`
  );
}

/**
 * @param {import("discord.js").GuildMember} member 
 */
function deleteMember(
  member
) {
  delete globalPoints[member.guild.id][member.id];
  delete reputationPoints[member.guild.id][member.id];
  delete seniority[member.guild.id][member.id];
  console.log(
    `deleted member: ${member.id}`
  );
}

/**
 * @param { String } path
 * @returns { JSON }  
 */
function loadFile(
  path
) {
  return JSON.parse(
    fs.readFileSync(
      path
    )
  );
}

/**
 * @param { String } path
 */
function saveFile(
  path,
  data
) {
  fs.writeFile(
    path,
    JSON.stringify(
      data
    ),
    function (
      error
    ) {
      if (
        error
      ) {
        console.error(
          error.message
        );
      }
    }
  );
}

/**
 * @param { import("../community.js").Community } community 
 * @param { Array<String> } messages 
 */
async function sendMesseges(
  messages,
  channel
) {
  function splitMessages(
    messages,
    size
  ) {
    let characters = 0;
    let chunk = "";
    let chunks = [];
    for (let i = 0; i < messages.length; i++) {
      characters += messages[i].length;
      if (characters < size) {
        chunk += messages[i];
      }
      else {
        chunks.push(chunk);
        chunk = "";
        characters = 0;
      }
    }
    if (!chunks.length) {
      return [chunk];
    }
    else {
      return chunks;
    }
  }
  if (messages.length) {
    let parts = splitMessages(messages, 2000);
    for (const part of parts) {
      const message = {
        content: part,
        flags: [4096]
      };
      await channel.send(message);
    }
  }
}

export {
  addMember,
  deleteMember,
  loadFile,
  saveFile,
  sendMesseges
};

