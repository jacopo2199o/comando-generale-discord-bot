import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Activity } from "./activity.js";

/**
 * @param { import("discord.js").Guild } guild
 */
const Community = function (guild) {
  this.activity = new Activity(this);
  this.id = guild.id;
  this.adminId = guild.ownerId;
  this.settings = (() => {
    const object = (() => {
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

        if (
          fs.existsSync(filePaths.activity)
          && fs.existsSync(filePaths.ranks)
          && fs.existsSync(filePaths.preferences)
        ) {
          return {
            filePaths,
            activity: fs.readFileSync(filePaths.activity),
            ranks: fs.readFileSync(filePaths.ranks),
            preferences: fs.readFileSync(filePaths.preferences)
          };
        }
      })();

      if (data) {
        return {
          filePaths: data.filePaths,
          activity: JSON.parse(data.activity),
          ranks: JSON.parse(data.ranks),
          preferences: JSON.parse(data.preferences)
        };
      }
    })();

    if (object) {
      return Object.freeze({
        filePaths: object.filePaths,
        activity: object.activity,
        ranks: object.ranks,
        preferences: object.preferences
      });
    }
  })();
};

export { Community };