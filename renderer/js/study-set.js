import {animate} from './animate.js';

//selectors for page elements
const back_button = document.getElementById("back-button");
const center_card = document.querySelector(".center-card");
const flashcard_page_list = document.querySelector(".flashcard-list");
let current = 0;
let next = 1;
let prev = -1;
let curr_display_card;
let prev_display_card;
let next_display_card;

//retrieves data from whatever set what clicked on on the
//"home" page
const set_data = ipcRenderer.sendSync("get-set-data");
const flashcards = set_data.flashcards;

for (const card of flashcards) {
  card.isFront = true;
}

//sends message to main process when back button is clicked
//to load the home window
back_button.addEventListener("click", () => {
  ipcRenderer.send("open-home-window");
});
//controls for cards
document.addEventListener("keypress", (event) => {
  handle_card_controls(event);
})

//creates cards elements and displays them on page
//based on given array of cards
function make_cards() {
  for (const [index, card] of flashcards.entries()) {
    if (index === current) {
      curr_display_card = document.createElement("li");
      curr_display_card.classList.add("card");
      curr_display_card.classList.add("curr-card");
      if (card.isFront) {
        curr_display_card.textContent = card.front;
      }
      else {
        curr_display_card.textContent = card.back;
      }
    flashcard_page_list.appendChild(curr_display_card);
    }
    else if (index === next) {
      next_display_card = document.createElement("li");
      next_display_card.classList.add("card");
      next_display_card.classList.add("next-card");
      next_display_card.textContent = card.front;
      if (card.isFront) {
        next_display_card.textContent = card.front;
      }
      else {
        next_display_card.textContent = card.back;
      }
    flashcard_page_list.appendChild(next_display_card);
    }
    else if (index === prev) {
      prev_display_card = document.createElement("li");
      prev_display_card.classList.add("card");
      prev_display_card.classList.add("prev-card");
      prev_display_card.textContent = card.front;
      if (card.isFront) {
        prev_display_card.textContent = card.front;
      }
      else {
        prev_display_card.textContent = card.back;
      }
    flashcard_page_list.appendChild(prev_display_card);
    }
  }
}

function clear_cards(list) {
  list.innerHTML = '';
}

function handle_card_controls(event) {
  if (event.key === 'd' && current != flashcards.length - 1) {
    current++;
    next++;
    prev++;
  }
  if (event.key === 'a' && current != 0) {
    current--;
    next--;
    prev--;
  }
  if (event.key === 'w' || event.key === 's') {
    flashcards[current].isFront = !flashcards[current].isFront;
    curr_display_card.textContent = '';
    curr_display_card.classList.add('animate');
  }
  setTimeout(function() {
    console.log("This message will appear after a 2-second pause.");
    clear_cards(flashcard_page_list);
    make_cards();
  }, 400); // 2000 milliseconds (2 seconds)
}



//main processes start here 
make_cards();
// animates the page events
// defined in animate.js


