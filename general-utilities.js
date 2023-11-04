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

const readFile = (path) => {
  const data = fs.readFileSync(path);
  return JSON.parse(data);
};

const saveFile = (data, filePath) => {
  const JSONData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, JSONData);
};

/**
 * @param { Array<String> } messages 
 * @param { Number } size 
 */
function splitMessages(messages, size) {
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
}

export {
  deepFreeze,
  saveFile,
  splitMessages,
  readFile
};