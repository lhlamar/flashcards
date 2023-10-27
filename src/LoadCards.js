//this file will contain functions that will read and write to the user's
//filesystem. it will be able to create access the created flashcards.
function getFolders() {
  console.log("test");
  const fs = require("fs");
  const os = require("os");
  const path = require("path");

  const dataPath = path.join(__dirname, "../flashcards");

  fs.readdir(dataPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }

    const folders = [];

    // Iterate through the files and filter for directories
    files.forEach((file) => {
      const folderPath = path.join(dataPath, file);
      if (fs.statSync(folderPath).isDirectory()) {
        folders.push(file);
      }
    });

    console.log(folders);
  });
}

function loadFlashCards() {
  const fs = require("fs");
  const os = require("os");
  const path = require("path");

  const dataPath = path.join(__dirname, "../flashcards/Spanish/numbers.json");

  let flashCardSet;

  try {
    const data = fs.readFileSync(dataPath, "utf8");
    flashCardSet = JSON.parse(data);
  } catch (err) {
    console.log("file doesn't exist");
  }
}

module.exports = {
  getFolders,
  loadFlashCards,
};
