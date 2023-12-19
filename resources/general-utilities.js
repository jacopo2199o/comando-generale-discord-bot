/**
 * @param { import("../community.js").Community } community 
 * @param { Array<String> } messages 
 */
const sendMesseges = async (community, messages) => {
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
      await community.logChannel.send({ content: part, flags: [4096] });
    }
  }
};

export { sendMesseges };