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
function getSetContents(set) {
  const fs = require("fs");

  // Specify the path to your JSON file
  const filePath = set;

  try {
    // Read the file synchronously
    const data = fs.readFileSync(filePath, "utf8");

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Now you can work with the JSON data
    return jsonData;
  } catch (error) {
    console.error("Error reading/parsing the file:", error);
    return null;
  }
}

function newFolder(name) {
  const fs = require("fs");

  const path = require("path");
  const directoryPath = path.join(__dirname, "../flashcards/" + name);

  fs.mkdir(directoryPath, (err) => {
    if (err) {
      console.error("error creating directory", err);
    } else {
      console.log("directory created successfully: ", name);
    }
  });
}

function createMainFlashcardFolder() {
  const fs = require("fs");

  const path = require("path");
  const directoryPath = path.join(__dirname, "../flashcards/");

  if (!fs.existsSync(directoryPath)) {
    fs.mkdir(directoryPath, (err) => {
      if (err) {
        console.error("error creating directory", err);
      } else {
        console.log("directory created successfully: ", "main card folder");
      }
    });
  }
}

function removeFolder(targetDir) {
  const fs = require("fs");
  const path = require("path");
  const rimraf = require("rimraf");
  targetDir = path.join(__dirname, "../flashcards/" + targetDir);

  if (fs.existsSync(targetDir)) {
    if (fs.lstatSync(targetDir).isDirectory()) {
      // List the files and subdirectories in the target directory
      const files = fs.readdirSync(targetDir);

      files.forEach((file) => {
        const filePath = path.join(targetDir, file);

        // Check if the item is a directory
        if (fs.lstatSync(filePath).isDirectory()) {
          // Recursively delete subdirectories
          deleteDirectoryRecursively(filePath);
        } else {
          // Delete files within the target directory
          fs.unlinkSync(filePath);
        }
      });

      // Use rimraf to remove the target directory itself
      rimraf.sync(targetDir);
    } else {
      // Handle the case where the targetDir is not a directory
      console.error(`${targetDir} is not a directory.`);
    }
  } else {
    // Handle the case where the targetDir doesn't exist
    console.error(`${targetDir} does not exist.`);
  }
}

function removeSet(folder, set) {
  const fs = require("fs");
  const path = require("path");

  filename = set + ".json";
  filePath = path.join(__dirname, "../flashcards/" + folder + "/" + filename);
  console.log(filePath);
  console.log(filename);
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    try {
      // Attempt to delete the file
      fs.unlinkSync(filePath);
      console.log(`File '${filename}' deleted successfully.`);
    } catch (err) {
      console.error(`Error deleting file '${filename}': ${err.message}`);
    }
  } else {
    console.error(
      `File '${filename}' does not exist in the directory '${filePath}'.`
    );
  }
}

function newSet(location, set_name, set_contents) {
  location = "./flashcards/" + location;
  const fs = require("fs");
  const path = require("path");

  // Create an object with the desired structure
  const flashcardSet = {
    flashcards: set_contents,
  };

  // The second argument (null) is for replacer
  //function, and the third argument (2) is for indentation.
  const flashcardSetJSON = JSON.stringify(flashcardSet, null, 2);

  // Define the path where the JSON file will be saved
  const filePath = path.join(location, `${set_name}.json`);

  // Write the JSON string to the file
  fs.writeFile(filePath, flashcardSetJSON, "utf8", (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log(`JSON file ${set_name}.json created at ${location}`);
    }
  });
}

module.exports = {
  getFolders,
  getFolderContents,
  getSetContents,
  newFolder,
  newSet,
  removeFolder,
  removeSet,
  createMainFlashcardFolder,
};
