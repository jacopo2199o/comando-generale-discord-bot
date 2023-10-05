import fs from "node:fs";

const deepFreeze = (object) => {
  Object.keys(object).forEach((property) => {
    if (
      typeof object[property] === "object" &&
      !Object.isFrozen(object[property])
    )
      deepFreeze(object[property]);
  });
  return Object.freeze(object);
};

const saveFile = (data, filePath) => {
  const JSONData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, JSONData, error => {
    if (error) throw error;
  });
};

export {
  deepFreeze,
  saveFile
};