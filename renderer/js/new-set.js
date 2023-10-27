let num_of_card = 2;

const back_button = document.getElementById("back-button");
const new_card_button = document.getElementById("new-item-button");
const card = document.querySelector(".card-container");
const card_list = document.querySelector(".flashcard-list-container");
const how_to_use_button = document.getElementById("how-to-use-button");

how_to_use_button.addEventListener("click", () => {
  ipcRenderer.send("open-how-to-use-window");
});

new_card_button.addEventListener("click", () => {
  new_card();
});

back_button.addEventListener("click", () => {
  ipcRenderer.send("open-home-window");
});

function new_card() {
  num_of_card++;
  const new_card = card.cloneNode(true);
  const new_card_header = new_card.querySelector(".card-header");
  new_card_header.innerHTML = `card ${num_of_card}`;

  card_list.appendChild(new_card);
}
