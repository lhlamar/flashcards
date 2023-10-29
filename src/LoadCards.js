//this file will contain functions that will read and write to the user's
//filesystem. it will be able to create access the created flashcards.

function getFolders() {
  const fs = require("fs");
  const os = require("os");
  const path = require("path");

  const dataPath = path.join(__dirname, "../flashcards");
  const folders = [];

  try {
    const files = fs.readdirSync(dataPath);

    // Iterate through the files and filter for directories
    files.forEach((file) => {
      const folderPath = path.join(dataPath, file);
      if (fs.statSync(folderPath).isDirectory()) {
        folders.push(file);
      }
    });

    return folders;
  } catch (err) {
    console.error(`Error reading directory: ${err}`);
    return null; // Return null or handle the error in your code
  }
}

function getFolderContents(folder) {
  const fs = require("fs");
  const os = require("os");
  const path = require("path");

  const dataPath = path.join(__dirname, "../flashcards/" + folder);
  const folderContents = [];

  try {
    const files = fs.readdirSync(dataPath);

    // Iterate through the files and filter for files
    files.forEach((file) => {
      const folderPath = path.join(dataPath, file);
      if (!fs.statSync(folderPath).isDirectory()) {
        folderContents.push(file);
      }
    });

    return folderContents;
  } catch (err) {
    console.error(`Error reading directory: ${err}`);
    return null; // Return null or handle the error in your code
  }
}

//parameter takes the directory as a string
//of the set that needs to be retrived
//returns a list of cards. each item in the list has a
//front and a back that it returns as well
function getSetContents(set, callback) {
  const fs = require("fs");

  // Specify the path to your JSON file
  const filePath = set;

  // Read the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      callback(err, null);
      return;
    }

    try {
      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Now you can work with the JSON data

      callback(null, jsonData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      callback(error, null);
    }
  });
}
module.exports = {
  getFolders,
  getFolderContents,
  getSetContents,
};
