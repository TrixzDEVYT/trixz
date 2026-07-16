/* ==========================================================================
   usagi portfolio — script.js
   Everything here is vanilla JS, no dependencies.
   Sections: dialogue data, dialogue engine, blinking, cursor sparkle,
   dark mode toggle.
   ========================================================================== */

/* ---------- 1. DIALOGUE DATA ----------
   Add / remove / edit entries freely. Each entry needs:
     text  -> what shows in the speech bubble
     image -> path to the mascot art for that line
   Put new art inside the images/ folder and reference it here. */
const dialogues = [
  {
    text: "um... make yourself comfy!!",
    image: "images/idle.png"
  },
  {
    text: "happy dialogue 1",
    image: "images/happy.png"
  },
  {
    text: "thinking dialogue 1",
    image: "images/thinking.png"
  },
  {
    text: "wave dialogue 1",
    image: "images/wave.png"
  },
  {
    text: "idle dialogue 1",
    image: "images/idle.png"
  }
];

/* ---------- 2. DIALOGUE ENGINE ---------- */
const mascotImg = document.getElementById("mascot-img");
const mascotFrame = document.querySelector(".mascot-frame");
const dialogueText = document.getElementById("dialogue-text");

let lastIndex = -1;
const DIALOGUE_INTERVAL = 8000; // ms between automatic dialogue changes

// picks a random dialogue index that isn't the same as the last one shown
function pickNextIndex() {
  if (dialogues.length === 1) return 0;
  let index;
  do {
    index = Math.floor(Math.random() * dialogues.length);
  } while (index === lastIndex);
  return index;
}

// swaps the mascot image + dialogue text with a short fade transition
function showDialogue(index) {
  const entry = dialogues[index];

  // fade out
  mascotImg.classList.add("fade-out");
  dialogueText.classList.add("fade-out");

  setTimeout(() => {
    mascotImg.src = entry.image;
    dialogueText.textContent = entry.text;

    // fade back in
    mascotImg.classList.remove("fade-out");
    dialogueText.classList.remove("fade-out");
  }, 350); // matches the CSS transition duration for opacity

  lastIndex = index;
}

function cycleDialogue() {
  const nextIndex = pickNextIndex();
  showDialogue(nextIndex);
}

// kick off the automatic cycle
setInterval(cycleDialogue, DIALOGUE_INTERVAL);

// optional: clicking the mascot also cycles to a new line, feels alive
mascotImg.addEventListener("click", cycleDialogue);

/* ---------- 3. BLINKING ---------- */
// randomly triggers a quick "blink" squash on the mascot frame
function scheduleBlink() {
  const delay = 2500 + Math.random() * 3500; // every 2.5s - 6s
  setTimeout(() => {
    mascotFrame.classList.add("blinking");
    setTimeout(() => mascotFrame.classList.remove("blinking"), 120);
    scheduleBlink();
  }, delay);
}
scheduleBlink();

/* ---------- 4. CURSOR SPARKLE EFFECT ---------- */
// throttled so it doesn't spam a sparkle on every single pixel of movement
let lastSparkleTime = 0;
const SPARKLE_THROTTLE_MS = 60;

document.addEventListener("mousemove", (e) => {
  const now = Date.now();
  if (now - lastSparkleTime < SPARKLE_THROTTLE_MS) return;
  lastSparkleTime = now;
  spawnSparkle(e.clientX, e.clientY);
});

function spawnSparkle(x, y) {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;

  // random little drift direction for the fade-out animation
  const dx = (Math.random() - 0.5) * 30;
  const dy = (Math.random() - 0.5) * 30 - 10;
  sparkle.style.setProperty("--dx", `${dx}px`);
  sparkle.style.setProperty("--dy", `${dy}px`);

  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 600); // matches sparkle-pop animation length
}

/* ---------- 5. DARK MODE TOGGLE ---------- */
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const root = document.documentElement;

// restore saved preference on load
const savedTheme = localStorage.getItem("usagi-theme");
if (savedTheme === "dark") {
  root.setAttribute("data-theme", "dark");
  themeIcon.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";
  if (isDark) {
    root.removeAttribute("data-theme");
    themeIcon.textContent = "🌙";
    localStorage.setItem("usagi-theme", "light");
  } else {
    root.setAttribute("data-theme", "dark");
    themeIcon.textContent = "☀️";
    localStorage.setItem("usagi-theme", "dark");
  }
});
