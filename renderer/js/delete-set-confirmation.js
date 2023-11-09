const yes_button = document.getElementById("yes-button");
const cancel_button = document.getElementById("cancel-button");

cancel_button.addEventListener("click", () => {
  ipcRenderer.send("close-delete-set-confirmation-window");
});

yes_button.addEventListener("click", () => {
  console.log("tt");
  ipcRenderer.send("delete-set-confirmation-window-proceed");

  ipcRenderer.send("close-delete-set-confirmation-window");
});
