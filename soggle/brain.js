import thing from "./assets/words.json" with { type: "json" };

const SOGGY = "soggy";
const WORD_LEN = 5;
const ROWS_NUMBER = 6;
const ANIMATION_DELAY = 100;
const KEYBOARD = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["delete", "z", "x", "c", "v", "b", "n", "m", "enter"],
];

const YIPPEEE = new Audio("/assets/sounds/confetti.mp3");
YIPPEEE.volume = 1.0;

let currentRow = 1;
let currentInput = "";
let rowElement;
let imdoinganimation = false;
let won = false;

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

// Source - https://stackoverflow.com/a/32567789
function isLetter(c) {
  return c.length == 1 && c.toLowerCase() != c.toUpperCase();
}

function isSoggy() {
  return currentInput == SOGGY;
}

function matchKeyboardKey(el, key) {
  switch (key) {
    case "delete":
      el.addEventListener("click", pop);
      break;
    case "enter":
      el.addEventListener("click", checkWord);
      break;
    default:
      el.addEventListener("click", function () {
        handleKey(key);
      });
      break;
  }
}

function generateKeyboard() {
  const keyboardElement = document.getElementById("keyboard");

  for (let i = 0; i <= 2; i++) {
    let row = KEYBOARD[i];
    let rowElement = document.createElement("div");
    rowElement.className = "kb_row";

    for (let k = 0; k < row.length; k++) {
      let key = row[k];
      let el = document.createElement("button");

      el.textContent = key.toUpperCase();
      el.className = key;
      rowElement.appendChild(el);

      matchKeyboardKey(el, key);
    }

    keyboardElement.appendChild(rowElement);
  }
}

function spawnRows() {
  const gameContainer = document.getElementById("game");

  for (let i = 0; i < ROWS_NUMBER; i++) {
    let element = document.createElement("div");
    element.className = `row${i}`;

    for (let k = 0; k < WORD_LEN; k++) {
      let letter = document.createElement("div");
      letter.className = `letter${k}`;

      letter.appendChild(document.createElement("p"));
      letter.appendChild(document.createElement("img"));

      element.appendChild(letter);
    }

    gameContainer.appendChild(element);
  }
}

async function checkWord() {
  if (imdoinganimation || won) return;
  if (currentInput.length != WORD_LEN || !isInDictionary()) {
    playShakyAnimation();
    return;
  }

  imdoinganimation = true;

  for (let i = 0; i < WORD_LEN; i++) {
    let element = rowElement.childNodes[i];
    let currentLetter = currentInput[i];
    let sog = SOGGY[i];

    // what the fuck is this syntax lmao
    if (currentLetter == sog) element.classList.add("green");
    else if (currentLetter != sog && SOGGY.includes(currentLetter))
      element.classList.add("yellow");
    else element.classList.add("gray");

    await sleep(ANIMATION_DELAY);
  }

  if (isSoggy()) {
    console.log("you are soggy!!");
    won = true;

    YIPPEEE.play();
    sleep(1500);
    yourdidit();
    sleep(2000);
    await generateSogs("/assets/images/soggy.avif", true);
  } else if (currentRow < ROWS_NUMBER) {
    currentRow = currentRow + 1;
    updateRowElement();
    currentInput = "";
  } else {
    console.log("you are DRY!!!!!!!!!!");
    won = true;
    yourdidntit();
    await generateSogs("/assets/images/dry.avif", false);
  }

  imdoinganimation = false;
}

function addKey(key) {
  if (!isLetter(key) || currentInput.length >= 5 || imdoinganimation || won) {
    return;
  }

  currentInput = currentInput.concat(key);
  updateRowDisplay();
}

function updateRowDisplay() {
  for (let i = 0; i < WORD_LEN; i++) {
    let box = rowElement.childNodes[i];
    let element = box.childNodes[0];
    let currentLetter = currentInput[i];

    if (!currentLetter) {
      element.textContent = "";
      box.classList.remove("occupied");
      continue;
    }

    box.classList.add("occupied");
    element.textContent = currentLetter.toUpperCase();
  }
}

function updateRowElement() {
  rowElement = document.querySelector(
    `#game>div[class^="row${currentRow - 1}"]`,
  );
}

function resetGame() {
  window.location.reload();
}

function isInDictionary() {
  return thing.words.includes(currentInput.trim());
}

function pop() {
  let len = currentInput.length;
  if (imdoinganimation || won || len <= 0) return;

  currentInput = currentInput.slice(0, len - 1);
  updateRowDisplay();
}

function playShakyAnimation() {
  rowElement.classList.add("wrong");

  setTimeout(() => {
    rowElement.classList.remove("wrong");
  }, 200);
}

function handleKey(key) {
  switch (key) {
    case "backspace":
      pop();
      break;
    case "enter":
      checkWord();
      break;
    default:
      addKey(key);
      break;
  }
}

function keyDown(event) {
  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) return;

  handleKey(event.key.toLowerCase());
}

spawnRows();
updateRowElement();
generateKeyboard();

document.getElementById("replay").addEventListener("click", resetGame);
document.addEventListener("keydown", (event) => keyDown(event));

function yourdidit() {
  const el = document.createElement("h1");
  el.textContent = "you sogged!";
  el.className = "sogged";

  let random = Math.random();
  el.style.left = `${random * 60}%`;
  el.style.top = `${random * 60}%`;
  el.style.fontSize = `${40 + Math.random() * 40}px`;

  document.body.appendChild(el);
}

async function yourdidntit() {
  const el = document.createElement("h1");
  el.textContent = "you are dry!!!!!!!!";
  el.className = "dried";

  let random = Math.random();
  el.style.left = `${random * 60}%`;
  el.style.top = `${random * 60}%`;
  el.style.fontSize = `${40 + Math.random() * 40}px`;

  document.body.appendChild(el);

  await sleep(500);
  const dark = document.createElement("div");
  dark.style.position = "fixed";
  dark.style.width = "100%";
  dark.style.height = "100%";
  dark.style.backgroundColor = "BLACK";
  document.body.appendChild(dark);
}

const WIDTH = [1, 150];
const HEIGHT = [1, 150];
const sogs = document.getElementById("sogs");
const VP_WIDTH = window.screen.width;
const VP_HEIGHT = window.screen.height;

async function generateSogs(the_image, soggy) {
  for (let i = 0; i < 500; i++) {
    let el = document.createElement("img");

    let height = HEIGHT[0] + Math.random() * (HEIGHT[1] - HEIGHT[0]);
    el.style.top = `-${height - 10}px`;
    el.style.left = `${Math.random() * VP_WIDTH}px`;
    sogs.appendChild(el);

    let random = Math.random();

    if (soggy) {
      const MEOW = new Audio("/assets/sounds/meow.flac");
      MEOW.volume = random * 0.7; // im saving your ears.
      MEOW.play();
    }

    el.src = the_image;
    el.width = WIDTH[0] + Math.random() * (WIDTH[1] - WIDTH[0]);
    el.height = height;
    el.className = "sog";
    el.animate([{ transform: `translateY(${VP_HEIGHT + height}px)` }], {
      duration: (0.1 + 10 * (1 - random)) * 1000,
      fill: "forwards",
    });

    el.onanimationend = () => el.remove();

    await sleep(random * 400);
  }
}
