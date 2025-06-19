//music
const musicBtn = document.getElementById("musicBtn");
const musicPopup = document.getElementById("musicPopup");
const overlay = document.getElementById("overlay");
const closePopup = document.getElementById("closePopup");
const audio = document.getElementById("audio");
const songList = document.getElementById("songList");
const currentSong = document.getElementById("currentSong");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const progressBar = document.getElementById("progressBar");

const songTitles = [
  "bad",
  "sunny_days",
  "peach_eyes",
  "evening_glow",
  "pink",
  "calla",
  "love",
  "homesick",
  "dried_flower",
  "sunburn",
  "akira",
  "nouvelle_vague",
  "so_real",
  "season",
  "wildflowers",
];

const songs = songTitles.map((title) => ({
  title: title.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  file: `music/${title}.mp3`,
}));

let currentSongIndex = 0;

// Load semua lagu ke daftar
function loadSongs() {
  songList.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.className = "cursor-pointer hover:text-pink-600 transition";
    li.onclick = () => {
      loadSong(index);
      audio.play();
      updatePlayPauseIcon();
    };
    songList.appendChild(li);
  });
}

function loadSong(index) {
  currentSongIndex = index;
  audio.src = songs[index].file;
  currentSong.textContent = songs[index].title;
}

function updatePlayPauseIcon() {
  playIcon.src = audio.paused ? "images/pause.png" : "images/play.png";
}

// Play/pause toggle
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
  updatePlayPauseIcon();
});

// Update progress bar
audio.addEventListener("timeupdate", () => {
  progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
});

progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});
//otomatis play
audio.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  updatePlayPauseIcon();
});

// Buka/tutup popup
function togglePopup() {
  musicPopup.classList.toggle("opacity-0");
  musicPopup.classList.toggle("translate-y-5");
  musicPopup.classList.toggle("pointer-events-none");
  overlay.classList.toggle("hidden");
}

musicBtn.addEventListener("click", togglePopup);
closePopup.addEventListener("click", togglePopup);
overlay.addEventListener("click", togglePopup);

// Load awal
loadSongs();