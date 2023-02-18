// @ts-nocheck
const tiles = document.getElementsByTagName("td");
const infoBtn = document.getElementById("info-btn");
const hintBtn = document.getElementById("hint-btn");
const darkBtn = document.getElementById("dark-btn");
const restartBtn = document.getElementById("restart-btn");
let dictionary = [];

let state = {
  col: 0,
  row: 0,
  word: "",
  hint: "",
  guess: "",
  hintBtn: false,
  darkMode: false,
  infoBtn: false,
};

function displayInfo() {
  if (!state.infoBtn) {
    document.getElementById("info-container").style.display = "flex";
    state.infoBtn = true;
  } else {
    document.getElementById("info-container").style.display = "none";
    state.infoBtn = false;
  }
}

function displayHint() {
  if (!state.hintBtn) {
    document.getElementById(
      "hint-container"
    ).innerHTML = `<h6>Hint: ${state.hint}</h6>`;
    document.getElementById("hint-container").style.display = "flex";
    state.hintBtn = true;
  } else {
    document.getElementById("hint-container").style.display = "none";
    state.hintBtn = false;
  }
}

function darkMode() {
  state.darkMode = !state.darkMode;
  if (!state.darkMode) {
    document.body.style.backgroundColor = "var(--light)";
    document.body.style.color = "var(--dark)";
    document.getElementsByTagName("nav")[0].style.borderBottom =
      "1px solid var(--dark)";
    document.getElementsByTagName("footer")[0].style.borderTop =
      "1px solid var(--dark)";
    document.getElementById("info-container").style.borderLeft =
      "1px solid var(--dark)";
    infoBtn.style.color = "var(--dark)";
    hintBtn.style.color = "var(--dark)";
    darkBtn.style.color = "var(--dark)";
  } else {
    document.body.style.backgroundColor = "var(--dark)";
    document.body.style.color = "var(--light)";
    document.getElementsByTagName("nav")[0].style.borderBottom =
      "1px solid var(--light)";
    document.getElementsByTagName("footer")[0].style.borderTop =
      "1px solid var(--light)";
    document.getElementById("info-container").style.borderLeft =
      "1px solid var(--light)";
    infoBtn.style.color = "var(--light)";
    hintBtn.style.color = "var(--light)";
    darkBtn.style.color = "var(--light)";
  }
}

function randomNum() {
  return Math.floor(Math.random() * dictionary.length);
}

function randomWord() {
  const word = dictionary[randomNum()];
  return word;
}

function restart() {
  document.getElementById("board-container").style.display = "flex";
  document.getElementById("congrats-container").style.display = "none";
  const random = randomWord();
  state.word = random.word.toUpperCase();
  state.hint = random.hint.toUpperCase();
  state.col = 0;
  state.row = 0;
  state.guess = "";
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].innerHTML = "";
    tiles[i].style.backgroundColor = "";
    console.log(tiles[i].style.backgroundColor);
  }
  console.log(state.row);
  console.log(state.col);
  console.log(state.word);
  console.log(state.hint);
}

function check(word, guess) {
  for (let i = 0; i <= 3; i++) {
    if (word[i] === guess[i]) {
      tiles[state.row * 4 + i].style.backgroundColor = "var(--right)";
    } else if (word.includes(guess[i])) {
      tiles[state.row * 4 + i].style.backgroundColor = "var(--wrong)";
    } else {
      tiles[state.row * 4 + i].style.backgroundColor = "var(--empty)";
    }
  }
  if (word === guess) {
    setTimeout(() => {
      document.getElementById("board-container").style.display = "none";
      document.getElementById("congrats-container").style.display = "flex";
      alert("You guessed the word");
    }, 500);
  }
}

function isLetter(key) {
  return key.length === 1 && key.match(/[A-Z]/i);
}

async function main() {
  try {
    // fetch data from api
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
      headers: {
        "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
      },
    });
    const data = await res.json();
    dictionary = data.dictionary;

    // set random word and hint
    const random = randomWord();
    state.word = random.word.toUpperCase();
    state.hint = random.hint.toUpperCase();

    console.log(state.word);
    console.log(state.hint);

    // add event listeners to tiles
    document.body.addEventListener("keydown", (e) => {
      const key = e.key.toUpperCase();
      if (key === "ENTER" || key === "RETURN") {
        if (
          state.col === 3 &&
          tiles[state.row * 4 + state.col].innerHTML !== ""
        ) {
          if (state.row >= 0 && state.row <= 3) {
            for (let i = 0; i <= 3; i++) {
              if (i === 0) state.guess = tiles[state.row * 4 + i].innerHTML;
              else state.guess += tiles[state.row * 4 + i].innerHTML;
            }
            console.log(state.guess);
            console.log(state.word);
            console.log(state.hint);
            check(state.word, state.guess);
            state.row++;
            state.col = 0;
          } else if (state.row === 4) {
            alert("You have reached the end of the table");
          }
        } else if (
          state.col === 3 &&
          tiles[state.row * 4 + state.col].innerHTML === ""
        ) {
          alert("Please fill all the tiles");
        } else if (state.col < 3) {
          alert("Please fill all the tiles");
        }
      } else if (key === "BACKSPACE") {
        if (state.col > 0 && state.col <= 3) {
          tiles[state.row * 4 + state.col].innerHTML = "";
          state.col--;
        } else if (state.col === 0) {
          if (tiles[state.row * 4 + state.col].innerHTML !== "") {
            tiles[state.row * 4 + state.col].innerHTML = "";
          }
        }
      } else if (isLetter(key)) {
        if (
          state.col >= 0 &&
          state.col < 3 &&
          state.row >= 0 &&
          state.row <= 3
        ) {
          tiles[state.row * 4 + state.col].innerHTML = key;
          state.col++;
        } else if (state.col === 3 && state.row >= 0 && state.row <= 3) {
          if (tiles[state.row * 4 + state.col].innerHTML === "") {
            tiles[state.row * 4 + state.col].innerHTML = key;
          }
        }
      }
    });

    // add event listeners
    restartBtn.addEventListener("click", restart);
    infoBtn.addEventListener("click", displayInfo);
    hintBtn.addEventListener("click", displayHint);
    darkBtn.addEventListener("click", darkMode);
  } catch (e) {
    throw new Error(e);
  }
}

main();
