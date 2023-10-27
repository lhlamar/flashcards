const how_to_use_button = document.getElementById("how-to-use-button");
const new_folder_button = document.getElementById("new-folder-button");
const folder_list = document.getElementById("folder-list");
const set_list = document.getElementById("set-list");

how_to_use_button.addEventListener("click", () => {
  ipcRenderer.send("open-how-to-use-window");
});

new_folder_button.addEventListener("click", () => {
  ipcRenderer.send("open-new-set-window");
});

const set_item = document.createElement("li");
const set_item_contents = document.createElement("a");
set_item_contents.className = "folder-item";
set_item_contents.href = "#";
set_item_contents.textContent = "geology";

set_item.appendChild(set_item_contents);

set_list.appendChild(set_item);
