let num_of_card = 2;
//this is the what will be gathered when the user
//selects 'done'
let finished_card_list = [];

const back_button = document.getElementById("back-button");
const new_card_button = document.getElementById("new-item-button");
const card = document.querySelector(".card-container");
const card_list = document.querySelector(".flashcard-list-container");
const how_to_use_button = document.getElementById("how-to-use-button");
const done_button = document.getElementById("done-button");
const set_header = document.getElementById("set-header");
const remove_card_button = document.querySelectorAll("#minus-button");

// this sends a message to the main process to get the folder
// that is open when the user clicks 'new set'
let set_folder = ipcRenderer.sendSync("get-folder-for-new-set");
set_header.textContent = `New ${set_folder} Set`;

how_to_use_button.addEventListener("click", () => {
  ipcRenderer.send("open-how-to-use-window");
});

new_card_button.addEventListener("click", () => {
  new_card();
});

back_button.addEventListener("click", () => {
  ipcRenderer.send("open-home-window");
});

done_button.addEventListener("click", () => {
  ipcRenderer.send("open-name-set-window");
  finish_set();
});

remove_card_button.forEach(function (button) {
  button.addEventListener("click", (event) => {
    remove_card(event);
  });
});

function new_card() {
  num_of_card++;
  const new_card = card.cloneNode(true);
  new_card.querySelector("#front-text").value = "";
  new_card.querySelector("#back-text").value = "";

  new_card.querySelector("#minus-button").addEventListener("click", (event) => {
    remove_card(event);
  });

  const new_card_header = new_card.querySelector(".card-header");
  new_card_header.innerHTML = `card ${num_of_card}`;

  card_list.appendChild(new_card);
}

function remove_card(event) {
  if (num_of_card > 1) {
    const card_to_delete = event.target.parentNode.parentNode;
    card_list.removeChild(card_to_delete);
    const set_headers = document.querySelectorAll(".card-header");
    set_headers.forEach(function (header, index) {
      index++;
      header.innerHTML = "card " + index;
    });

    num_of_card--;
    const renumber_cards = document.querySelectorAll("#set-header");
  } else {
    Toastify.toast({
      text: "you must have at least one card in your set",
      duration: 1500,
      close: false,
      style: {
        background: "red",
        color: "white",
        textAlign: "center",
      },
    });
  }
}

//this function is activated when the done button is pressed.
//it takes all the card information, formats it, and sends
//it to the main process where it will be used to create
//the .json file where the set will be stored
function finish_set() {
  //this loop looks though each "card item" in the new set
  for (let i = 0; i < card_list.childNodes.length; i++) {
    const item = card_list.childNodes[i];
    if (item.className === "card-container") {
      const front_text = item.querySelector("#front-text").value;
      const back_text = item.querySelector("#back-text").value;
      const card = { front: front_text, back: back_text };
      finished_card_list.push(card);
    }
  }

  ipcRenderer.send("finish-new-set", finished_card_list);
}
