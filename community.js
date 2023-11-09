import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Activity } from "./activity.js";

/**
 * @param { import("discord.js").Guild } guild
 */
const Community = function (guild) {
  this.activity = new Activity(this);
  this.client = guild.client;
  this.id = guild.id;
  this.adminId = guild.ownerId;
  this.settings = (() => {
    const data = (() => {
      const filePaths = ((activitySuffix, ranksSuffix, preferencesSuffix) => {
        const partialFilePaths = ((name, regexp) => {
          const resourcesFolders = ((activityFolder, ranksFolder, preferencesFolder) => {
            const resourcesFolder = ((resourcesFolder) => {
              const baseDirectory = ((fileURL) => {
                const basePath = fileURLToPath(fileURL);
                return path.dirname(basePath);
              })(import.meta.url);
              return baseDirectory + resourcesFolder;
            })("\\resources");
            return {
              activity: resourcesFolder + activityFolder,
              ranks: resourcesFolder + ranksFolder,
              preferences: resourcesFolder + preferencesFolder
            };
          })("\\activity\\", "\\ranks\\", "\\preferences\\");
          return {
            activity: resourcesFolders.activity + name.replace(regexp, "-"),
            ranks: resourcesFolders.ranks + name.replace(regexp, "-"),
            preferences: resourcesFolders.preferences + name.replace(regexp, "-")
          };
        })(guild.name, /\s+/g);
        return {
          activity: partialFilePaths.activity.concat(activitySuffix),
          ranks: partialFilePaths.ranks.concat(ranksSuffix),
          preferences: partialFilePaths.preferences.concat(preferencesSuffix)
        };
      })("-activity.json", "-ranks.json", "-preferences.json");

      const data = {
        filePaths,
        activity: undefined,
        ranks: undefined,
        preferences: undefined
      };

      if (fs.existsSync(filePaths.activity)) {
        data.activity = fs.readFileSync(filePaths.activity);
      } else {
        fs.writeFileSync(filePaths.activity, "[]");
      }

      if (fs.existsSync(filePaths.ranks)) {
        data.ranks = fs.readFileSync(filePaths.ranks);
      } else {
        fs.writeFileSync(filePaths.ranks, "[]");
      }

      if (fs.existsSync(filePaths.preferences)) {
        data.preferences = fs.readFileSync(filePaths.preferences);
      } else {
        fs.writeFileSync(filePaths.preferences, "{}");
      }

      return data;
    })();

    if (data.activity) {
      data.activity = JSON.parse(data.activity);
    } else {
      data.activity = [];
    }

    if (data.ranks) {
      data.ranks = JSON.parse(data.ranks);
    } else {
      data.ranks = [];
    }

    if (data.preferences) {
      data.preferences = JSON.parse(data.preferences);
    } else {
      data.preferences = {};
    }

    return Object.defineProperty(data, "filePath", {
      writable: false,
      configurable: false
    });
  })();
};

export { Community };