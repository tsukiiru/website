let i = 5;

let els = document.getElementsByClassName("window");
Array.prototype.forEach.call(els, function (w) {
  w.addEventListener("click", () => {
    i += 1;
    w.style.zIndex = i;
  });
});

interact(".window").draggable({
  allowFrom: ".title>span",
  modifiers: [
    interact.modifiers.restrictRect({
      endOnly: true,
    }),
  ],
  listeners: {
    move(event) {
      const target = event.target;
      const x = parseFloat(target.getAttribute("data-x") || 0) + event.dx;
      const y = parseFloat(target.getAttribute("data-y") || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    },
  },
});

const WINDOW_ANIMATION_TIME_MS = 300;

document.querySelectorAll(".navigate>a, #home a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const id = link.getAttribute("href").slice(1);

    history.pushState(null, "", link.getAttribute("href"));

    let elementClassList = !id
      ? document.getElementById("home").classList
      : document.getElementById(id)?.classList;

    // hidden
    if (elementClassList.contains("hidden")) {
      elementClassList.remove("animate-window-out", "hidden");
      elementClassList.add("animate-window-in");
    } else {
      elementClassList.remove("animate-window-in");
      elementClassList.add("animate-window-out");

      setTimeout(
        () => elementClassList.add("hidden"),
        WINDOW_ANIMATION_TIME_MS,
      );
    }
  });
});

const CLICK_AUDIO = new Audio("assets/sounds/click.wav");
const WHOOSH_AUDIO = new Audio("assets/sounds/whoosh.wav");
WHOOSH_AUDIO.volume = 0.6;

document.querySelectorAll(".exit-button").forEach((button) => {
  button.addEventListener("click", () => {
    WHOOSH_AUDIO.play();
    let targetClassList = button.closest(".window").classList;

    targetClassList.remove("animate-window-in");
    targetClassList.add("animate-window-out");

    setTimeout(() => targetClassList.add("hidden"), WINDOW_ANIMATION_TIME_MS);
  });
});

document.querySelectorAll("a").forEach((button) => {
  button.addEventListener("click", () => {
    CLICK_AUDIO.play();
  });
});

const MUSIC = [
  { artist: "Toby Fox", name: "Home", src: "assets/sounds/Home.flac" },
  {
    artist: "Toby Fox",
    name: "Memory",
    src: "assets/sounds/Memory.flac",
  },
  {
    artist: "Toby Fox",
    name: "It's raining somewhere else",
    src: "assets/sounds/It\'s\ Raining\ Somewhere\ Else.flac",
  },
  {
    artist: "C418",
    name: "Subwoofer Lullaby",
    src: "assets/sounds/Subwoofer\ Lullaby.flac",
  },
  {
    artist: "Toby Fox",
    name: "You Can Always Come Home",
    src: "assets/sounds/You\ Can\ Always\ Come\ Home.flac",
  },
];

let song_playing = false;
let text;
let current_song;
let current_audio = new Audio();
const SONG_DISPLAY = document.getElementById("music");

random_song();
SONG_DISPLAY.textContent = `♫ PAUSED: ${text}`;

SONG_DISPLAY.addEventListener("click", function () {
  song_playing = !song_playing;

  if (song_playing) {
    current_audio.play();
  } else {
    current_audio.pause();
  }
  updateElement();
});

function updateElement() {
  if (song_playing) {
    SONG_DISPLAY.classList.add("wiggle");
    SONG_DISPLAY.textContent = `♫ PLAYING: ${text}`;
  } else {
    SONG_DISPLAY.classList.remove("wiggle");
    SONG_DISPLAY.textContent = `♫ PAUSED: ${text}`;
  }
}

function random_song() {
  let selected = MUSIC[Math.floor(MUSIC.length * Math.random())];

  if (current_song && selected.name == current_song.name) {
    random_song();
    return;
  }

  current_song = selected;
  current_audio.src = current_song.src;

  text = `${current_song.name} - ${current_song.artist}`;
  updateElement();

  if (song_playing) current_audio.play();
  else current_audio.pause();
}

current_audio.addEventListener("ended", function () {
  current_audio.pause();
  current_audio.currentTime = 0;
  random_song();
});
