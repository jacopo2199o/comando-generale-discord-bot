import fs from "node:fs";
import {
  globalPoints,
  reputationPoints,
  seniority
} from "../events/ready.js";
import http from "node:http";

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
function saveFile(filePath, data) {
  if (data === undefined) {
    console.error(`Data is undefined for file: ${filePath}`);
    return;
  }
  try {
    fs.writeFileSync(filePath, JSON.stringify(data)); // Aggiungi formattazione per leggibilità
  } catch (error) {
    console.error(`Failed to save file ${filePath}:`, error.message);
  }
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
    const chunks = [];
    for (
      let i = 0;
      i < messages.length;
      i++
    ) {
      characters += messages[i].length;
      if (
        characters < size
      ) {
        chunk += messages[i];
      }
      else {
        chunks.push(
          chunk
        );
        chunk = "";
        characters = 0;
      }
    }
    if (
      !chunks.length
    ) {
      return [chunk];
    }
    else {
      return chunks;
    }
  }

  if (
    messages.length
  ) {
    const parts = splitMessages(messages, 2000);
    for (
      const part of parts
    ) {
      const message = {
        content: part,
        flags: [4096]
      };
      await channel.send(
        message
      );
    }
  }
}

/**
 * Ottieni la lista dei giocatori attivi su una mappa tramite API.
 * @param {number} map_id - ID della mappa
 * @returns {Promise<Array<{name: string, value: string}>>} Lista di giocatori per l'autocompletamento
 */
async function getPlayersNicknames(
  map_id
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const options = {
        host: "localhost",
        port: "3000",
        path: `/map/players?map_id=${map_id}`,
        method: "GET",
        timout: 5000
      };
      const req = http.request(
        options,
        res => {
          let data = "";
          res.on(
            "data",
            chunk => {
              data += chunk;
            }
          ).on(
            "end",
            () => {
              try {
                // formatta i giocatori per l'autocompletamento di Discord
                const players = JSON.parse(
                  data
                ).map(
                  player => (
                    {
                      name: player.nickname,  // testo visibile nel menu
                      value: player.id        // valore restituito al bot (può essere l'ID o il nickname)
                    }
                  )
                );
                resolve(
                  players
                );
              } catch (
              __error
              ) {
                reject(
                  "failed to parse player data"
                );
              }
            }
          );
        }
      ).on(
        "error",
        error => {
          reject(
            error
          );
        }
      ).on(
        "timeout",
        () => {
          req.destroy();
          reject(
            "request timout"
          );
        }
      );
      req.end();
    }
  );
}

export {
  addMember,
  deleteMember,
  getPlayersNicknames,
  loadFile,
  saveFile,
  sendMesseges
};

