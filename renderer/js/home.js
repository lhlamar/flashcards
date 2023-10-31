const how_to_use_button = document.getElementById("how-to-use-button");
const new_set_button = document.getElementById("new-set-button");
const new_folder_button = document.getElementById("new-folder-button");
const folder_list = document.getElementById("folder-list");
const set_list = document.getElementById("set-list");

let selectedElement = null;

how_to_use_button.addEventListener("click", () => {
  ipcRenderer.send("open-how-to-use-window");
});

new_set_button.addEventListener("click", () => {
  ipcRenderer.send("open-new-set-window");
});

new_folder_button.addEventListener("click", () => {
  ipcRenderer.send("open-new-folder-window");
})

//sends request to main process asking for folders in the set
folders = ipcRenderer.sendSync("main", "ping");
console.log(folders);

for (folder in folders) {
  const folder_item = document.createElement("li");
  const folder_item_contents = document.createElement("li");
  folder_item_contents.className = "folder-item";
  folder_item_contents.classList.add("not-selected");
  folder_item_contents.href = "#";
  folder_item_contents.textContent = folders[folder];
  folder_item.appendChild(folder_item_contents);
  folder_list.appendChild(folder_item);

  // Double-click event listener for items
  folder_item_contents.addEventListener("dblclick", (event) => {
    const item = event.target;
    if (selectedElement != null) selectedElement.classList.remove("selected");
    if (selectedElement != null) selectedElement.classList.add("not-selected");

    if (item.classList.contains("not-selected")) {
      item.classList.remove("not-selected");
      item.classList.add("selected");
      selectedElement = item;
    }
    loadSets(selectedElement.textContent);

    console.log(selectedElement);
  });
}

//loads the sets of a folder when the folder is clicked
function loadSets(folder) {
  folderContents = ipcRenderer.sendSync("secondary", folder);
  console.log(folderContents);

  while (set_list.firstChild) {
    set_list.removeChild(set_list.firstChild);
  }

  for (set in folderContents) {
    const set_item = document.createElement("li");
    const set_item_contents = document.createElement("li");
    set_item_contents.className = "folder-item";
    set_item_contents.href = "#";
    set_item_trimmed = folderContents[set].slice(0, -5);
    set_item_contents.textContent = set_item_trimmed;
    set_item.appendChild(set_item_contents);
    set_list.appendChild(set_item);
    set_item_contents.addEventListener("dblclick", (event) => {
      //send the url of the set to load
      ipcRenderer.send(
        "open-study-set-window",
        "../flashcards/flashcards/" +
          folder +
          "/" +
          event.target.textContent +
          ".json"
      );
    });
  }
}
