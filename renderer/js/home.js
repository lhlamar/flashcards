const how_to_use_button = document.getElementById("how-to-use-button");
const new_set_button = document.getElementById("new-set-button");
const new_folder_button = document.getElementById("new-folder-button");
const folder_list = document.getElementById("folder-list");
const set_list = document.getElementById("set-list");
const remove_folder_button = document.getElementById("remove-folder-button");
const remove_set_button = document.getElementById("remove-set-button");
const edit_set_button = document.querySelector("#edit-set-button");

let selectedElement = null;
let selectedSet = null;

ipcRenderer.on("null-set-error", () => {
  Toastify.toast({
    text: "somehow this set is empty, please select one that's not",
    duration: 1500,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    },
  });
});

how_to_use_button.addEventListener("click", () => {
  ipcRenderer.send("open-how-to-use-window");
});

new_set_button.addEventListener("click", () => {
  if (selectedElement) {
    ipcRenderer.send("open-new-set-window", selectedElement.textContent);
  } else {
    Toastify.toast({
      text: "Please Select a Folder for your Set",
      duration: 1500,
      close: false,
      style: {
        background: "red",
        color: "white",
        textAlign: "center",
      },
    });
  }
});

new_folder_button.addEventListener("click", () => {
  ipcRenderer.send("open-new-folder-window");
});

remove_folder_button.addEventListener("click", () => {
  ipcRenderer.send("remove-folder", selectedElement.innerText);
});

remove_set_button.addEventListener("click", () => {
  if (selectedSet != null) {
    ipcRenderer.send("remove-set", selectedSet.innerText);
  } else {
    Toastify.toast({
      text: "Please Select a set to remove",
      duration: 1500,
      close: false,
      style: {
        background: "red",
        color: "white",
        textAlign: "center",
      },
    });
  }
});

edit_set_button.addEventListener("click", () => {
  if (selectedSet != null) {
    console.log(selectedSet);
  } else {
    Toastify.toast({
      text: "Please Select a set to edit",
      duration: 1500,
      close: false,
      style: {
        background: "red",
        color: "white",
        textAlign: "center",
      },
    });
  }
});

//sends request to main process asking for folders
folders = ipcRenderer.sendSync("main");

for (folder in folders) {
  const folder_item = document.createElement("li");
  const folder_item_contents = document.createElement("li");
  folder_item_contents.className = "folder-item";
  folder_item_contents.classList.add("not-selected");
  folder_item_contents.href = "#";
  folder_item_contents.textContent = folders[folder];
  folder_item.appendChild(folder_item_contents);
  folder_list.appendChild(folder_item);

  folder_item_contents.addEventListener("click", (event) => {
    selectedSet = null;
    const item = event.target;
    if (selectedElement != null) selectedElement.classList.remove("selected");
    if (selectedElement != null) selectedElement.classList.add("not-selected");

    if (item.classList.contains("not-selected")) {
      item.classList.remove("not-selected");
      item.classList.add("selected");
      selectedElement = item;
    }
    ipcRenderer.send("selected", selectedElement.innerText);
    loadSets(selectedElement.textContent);
  });
}

//loads the sets of a folder when the folder is clicked
function loadSets(folder) {
  folderContents = ipcRenderer.sendSync("secondary", folder);
  console.log(folderContents);

  while (set_list.firstChild) {
    set_list.removeChild(set_list.firstChild);
  }

  if (folderContents.length != 0) {
    for (set in folderContents) {
      const set_item = document.createElement("li");
      const set_item_contents = document.createElement("li");
      set_item_contents.className = "folder-item";
      set_item_contents.href = "#";
      set_item_trimmed = folderContents[set].slice(0, -5);
      set_item_contents.textContent = set_item_trimmed;
      set_item.appendChild(set_item_contents);
      set_list.appendChild(set_item);
      set_item_contents.classList.add("not-selected");
      //adds single click event listener to the items
      //in the set window so they are highlighted
      //when the user clicks them
      set_item_contents.addEventListener("click", (event) => {
        const item = event.target;
        if (selectedSet != null) selectedSet.classList.remove("selected");
        if (selectedSet != null) selectedSet.classList.add("not-selected");

        if (item.classList.contains("not-selected")) {
          item.classList.remove("not-selected");
          item.classList.add("selected");
          selectedSet = item;
        }
      });
      set_item_contents.addEventListener("dblclick", (event) => {
        //send the url of the set to load
        ipcRenderer.send(
          "open-study-set-window",
          "./flashcards/" + folder + "/" + event.target.textContent + ".json"
        );
      });
    }
  } else {
    const placeholder = document.createElement("h2");
    placeholder.innerText = "no sets in this folder yet";
    set_list.appendChild(placeholder);
  }
}
