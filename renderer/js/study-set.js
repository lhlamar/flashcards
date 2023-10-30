import {animate} from './animate.js';

//selectors for page elements
const back_button = document.getElementById("back-button");
const center_card = document.querySelector(".center-card");
const flashcard_page_list = document.querySelector(".flashcard-list");
let current = 1;
let next = 2;
let prev = 0;

//retrieves data from whatever set what clicked on on the
//"home" page
const set_data = ipcRenderer.sendSync("get-set-data");
const flashcards = set_data.flashcards;
console.log(flashcards);

//sends message to main process when back button is clicked
//to load the home window
back_button.addEventListener("click", () => {
  ipcRenderer.send("open-home-window");
});



//creates cards elements and displays them on page
//based on given array of cards
for (const [index, card] of flashcards.entries()) {
  const display_card = document.createElement("li");
  display_card.classList.add("card");
  if (index === current) display_card.classList.add("curr-card");;
  if (index === next) display_card.classList.add("next-card");;
  if (index === prev) display_card.classList.add("prev-card");;
  display_card.textContent = card.front;
  flashcard_page_list.appendChild(display_card);
}








//animates the page events
//defined in animate.js
animate({
  duration: 300,
  //this is where the timing function is defined
  //this can be changed to quadratic and a number of other function
  //to change the rate that the animation changes
  timing(timeFraction) {
    return timeFraction; // linear
  },
  draw(progress) {
    center_card.style.left = progress * 100 + "px";
  },
});
