import fs from "node:fs";
import { globalPoints, reputationPoints, seniority } from "../events/ready.js";

/**
 * @param {import("discord.js").GuildMember} member 
 */
const addMember = (member) => {
  globalPoints[member.guild.id][member.id] = 0;
  reputationPoints[member.guild.id][member.id] = { points: 0, gaveTo: "" };
  seniority[member.guild.id][member.id] = 0;
};

/**
 * @param { String } path
 * @returns { JSON }  
 */
const loadFile = async (path) => {
  const data = fs.readFileSync(path);

  return JSON.parse(data);
};

/**
 * @param {import("discord.js").GuildMember} member 
 */
const deleteMember = (member) => {
  delete globalPoints[member.guild.id][member.id];
  delete reputationPoints[member.guild.id][member.id];
  delete seniority[member.guild.id][member.id];
  console.log("deleted member", member.id);
};

/**
 * @param { String } path
 */
const saveFile = async (path, data) => {
  const rawData = JSON.stringify(data);

  fs.writeFile(path, rawData, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

/**
 * @param { import("../community.js").Community } community 
 * @param { Array<String> } messages 
 */
const sendMesseges = async (messages, channel) => {
  const splitMessages = (messages, size) => {
    let characters = 0;
    let chunk = "";
    let chunks = [];

    for (let i = 0; i < messages.length; i++) {
      characters += messages[i].length;

      if (characters < size) {
        chunk += messages[i];
      } else {
        chunks.push(chunk);
        chunk = "";
        characters = 0;
      }
    }

    if (!chunks.length) {
      return [chunk];
    } else {
      return chunks;
    }
  };

  if (messages.length) {
    let parts = splitMessages(messages, 2000);

    for (let part of parts) {
      await channel.send({
        content: part,
        flags: [4096]
      });
    }
  }
};

export {
  addMember, deleteMember, loadFile, saveFile,
  sendMesseges
};

