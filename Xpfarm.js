
const matchSets = [
  {
    "EINS": "1",
    "ZWEI": "2",
    "DREI": "3",
    "VIER": "4",
    "FÜNF": "5",
  },
  {
    "HELLO": "HALLO",
    "PLEASE": "BITTE",
    "SORRY": "ENTSCHULDIGUNG",
    "YES": "JA",
    "WATER": "WASSER",
  },
  {
    "MOTHER": "MUTTER",
    "FATHER": "VATER",
    "UNCLE": "ONKEL",
    "AUNT": "TANTE",
    "FRIEND": "FREUND"
  },
  {
    "NEUNZIG": "90",
    "ESSEN": "FOOD",
    "SCHAF": "SHEEP",
    "KIND": "CHILD",
    "AFFE": "MONKEY",
  },
  {
    "DOG": "HUND",
    "CAT": "KATZE",
    "FISH": "FISCH",
    "COW": "KUH",
    "HORSE": "PFERD"
  }
];

let matchPairs = {};
let currentSetIndex = 0;
let selectedWord = null;
let matched = {};
let xp = 0;
let maxXP = 5;
let heartsLeft = 3;
let stars = 0;

const wordButtons = document.querySelectorAll(".word");
const matchButtons = document.querySelectorAll(".match");
const progress = document.querySelector(".progress");
const hearts = document.querySelectorAll(".heart");

wordButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    clearActive(wordButtons);
    selectedWord = btn.textContent;
    btn.classList.add("active");
  });
});

matchButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!selectedWord || matched[selectedWord]) return;
    const selectedMatch = btn.textContent;
    const wordBtn = Array.from(wordButtons).find(w => w.textContent === selectedWord);
    if (matchPairs[selectedWord] === selectedMatch) {
      btn.classList.add("correct");
      wordBtn.classList.add("correct");
      markMatched(selectedWord, btn, wordBtn);
      updateXP();
    } else {
      btn.classList.add("wrong");
      wordBtn.classList.add("wrong");
      fadeHeart();
      setTimeout(() => {
        btn.classList.remove("wrong");
        wordBtn.classList.remove("wrong");
      }, 700);
    }
    clearActive(wordButtons);
    selectedWord = null;
  });
});

function clearActive(buttons) {
  buttons.forEach(btn => btn.classList.remove("active"));
}

function markMatched(word, matchBtn, wordBtn) {
  matched[word] = true;
  matchBtn.disabled = true;
  wordBtn.disabled = true;
}

function updateXP() {
  xp++;
  let percentage = Math.min((xp / maxXP) * 100, 100);
  progress.style.width = `${percentage}%`;
  let xpBar = document.getElementById("xp-bar-fill");
  if (xp >= maxXP) {
    xp = 0;
    stars++;
    document.getElementById("star-count").textContent = stars;
    document.getElementById("star-counter").style.color = "gold";
    setTimeout(() => {
      document.getElementById("star-counter").style.color = "";
    }, 500);
  }
  xpBar.style.width = `${(xp / maxXP) * 100}%`;
}

document.getElementById("next-btn").addEventListener("click", () => {
  currentSetIndex = (currentSetIndex + 1) % matchSets.length;
  xp = 0;
  stars = 0;
  document.getElementById("xp-bar-fill").style.width = "0%";
  document.getElementById("star-count").textContent = "0";
  loadProblemSet(currentSetIndex);
});

function fadeHeart() {
  if (heartsLeft <= 0) return;
  heartsLeft--;
  hearts[heartsLeft].style.color = "#4b004b";
  if (heartsLeft === 0) showGameOverMessage();
}

function showGameOverMessage() {
  const msgBox = document.createElement("div");
  msgBox.innerHTML = `<div class="game-over-box">
    <h2>All hearts lost 💔</h2>
    <p>Try again!</p>
    <button onclick="resetGame()">Restart</button>
  </div>`;
  msgBox.style.position = "fixed";
  msgBox.style.top = "50%";
  msgBox.style.left = "50%";
  msgBox.style.transform = "translate(-50%, -50%)";
  msgBox.style.background = "#300038";
  msgBox.style.color = "white";
  msgBox.style.padding = "30px 50px";
  msgBox.style.borderRadius = "20px";
  msgBox.style.boxShadow = "0 0 20px 5px red";
  msgBox.style.zIndex = "20";
  msgBox.style.textAlign = "center";
  const btn = msgBox.querySelector("button");
  btn.style.padding = "10px 25px";
  btn.style.marginTop = "15px";
  btn.style.border = "none";
  btn.style.borderRadius = "12px";
  btn.style.background = "#ff3c3c";
  btn.style.color = "white";
  btn.style.fontSize = "16px";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.4)";
  btn.style.transition = "0.2s";
  btn.onmouseenter = () => btn.style.background = "#ff1e1e";
  btn.onmouseleave = () => btn.style.background = "#ff3c3c";
  document.body.appendChild(msgBox);
}

const sidebar = document.getElementById("sidebar");
const menuIcon = document.getElementById("menu-icon");
const closeBtn = document.getElementById("close-btn");

const blurOverlay = document.createElement("div");
blurOverlay.id = "blur-overlay";
blurOverlay.style.position = "fixed";
blurOverlay.style.top = "0";
blurOverlay.style.left = "0";
blurOverlay.style.width = "100vw";
blurOverlay.style.height = "100vh";
blurOverlay.style.background = "rgba(0, 0, 0, 0.3)";
blurOverlay.style.backdropFilter = "blur(5px)";
blurOverlay.style.zIndex = "9";
blurOverlay.style.display = "none";
document.body.appendChild(blurOverlay);

menuIcon.addEventListener("click", () => {
  sidebar.style.left = "0";
  blurOverlay.style.display = "block";
  document.body.classList.add("sidebar-open");
});

function closeSidebar() {
  sidebar.style.left = "-200px";
  blurOverlay.style.display = "none";
  document.body.classList.remove("sidebar-open");
}

closeBtn.addEventListener("click", closeSidebar);
blurOverlay.addEventListener("click", closeSidebar);

const learnTab = document.getElementById("learn-tab");
const xpfarmTab = document.getElementById("xpfarm-tab");
const recallTab = document.getElementById("recall-tab");

const learnSection = document.getElementById("learn-section");
const xpfarmSection = document.getElementById("xpfarm-section");
const recallSection = document.getElementById("recall-section");

const tabs = [learnTab, xpfarmTab, recallTab];
const sections = [learnSection, xpfarmSection, recallSection];

function switchTab(tabElement, sectionElement) {
  tabs.forEach(t => t.classList.remove("active"));
  sections.forEach(s => s.style.display = "none");
  tabElement.classList.add("active");
  sectionElement.style.display = "block";
}

learnTab.addEventListener("click", () => {
  switchTab(learnTab, learnSection);
  document.getElementById("recall-content").style.display = "none";
});

xpfarmTab.addEventListener("click", () => {
  switchTab(xpfarmTab, xpfarmSection);
  document.getElementById("recall-content").style.display = "none";
});

recallTab.addEventListener("click", () => {
  switchTab(recallTab, recallSection);
  document.getElementById("recall-content").style.display = "block";
});

function speak(button, word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'de-DE';
  speechSynthesis.speak(utterance);
  button.classList.add("active");
  utterance.onend = () => {
    button.classList.remove("active");
  };
}

function shuffleElements(containerSelector) {
  const container = document.querySelector(containerSelector);
  const buttons = Array.from(container.children);
  for (let i = buttons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    container.appendChild(buttons[j]);
  }
}

shuffleElements(".words");
shuffleElements(".matches");

function resetGame() {
  xp = 0;
  heartsLeft = 3;
  selectedWord = null;
  matched = {};
  progress.style.width = '0%';
  wordButtons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'wrong');
  });
  matchButtons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'wrong');
  });
  hearts.forEach(h => h.style.color = 'red');
  document.querySelector('.game-over-box')?.parentElement?.remove();
  shuffleElements(".words");
  shuffleElements(".matches");
}

loadProblemSet(0);

function loadProblemSet(index) {
  const wordContainer = document.querySelector(".words");
  const matchContainer = document.querySelector(".matches");
  wordContainer.innerHTML = "";
  matchContainer.innerHTML = "";
  matchPairs = matchSets[index];
  matched = {};
  selectedWord = null;
  Object.keys(matchPairs).forEach(word => {
    const wordBtn = document.createElement("button");
    wordBtn.textContent = word;
    wordBtn.className = "word";
    wordBtn.addEventListener("click", () => {
      clearActive(wordButtons);
      selectedWord = wordBtn.textContent;
      wordBtn.classList.add("active");
    });
    wordContainer.appendChild(wordBtn);
  });
  Object.values(matchPairs).forEach(match => {
    const matchBtn = document.createElement("button");
    matchBtn.textContent = match;
    matchBtn.className = "match";
    matchBtn.addEventListener("click", () => {
      if (!selectedWord || matched[selectedWord]) return;
      const wordBtn = [...document.querySelectorAll(".word")].find(w => w.textContent === selectedWord);
      if (matchPairs[selectedWord] === matchBtn.textContent) {
        matchBtn.classList.add("correct");
        wordBtn.classList.add("correct");
        markMatched(selectedWord, matchBtn, wordBtn);
        updateXP();
      } else {
        matchBtn.classList.add("wrong");
        wordBtn.classList.add("wrong");
        fadeHeart();
        setTimeout(() => {
          matchBtn.classList.remove("wrong");
          wordBtn.classList.remove("wrong");
        }, 700);
      }
      clearActive(document.querySelectorAll(".word"));
      selectedWord = null;
    });
    matchContainer.appendChild(matchBtn);
  });
  shuffleElements(".words");
  shuffleElements(".matches");
}

document.getElementById("next-btn").addEventListener("click", () => {
  currentSetIndex = (currentSetIndex + 1) % matchSets.length;
  loadProblemSet(currentSetIndex);
});

window.addEventListener("DOMContentLoaded", () => {
  switchTab(learnTab, learnSection);
  document.getElementById("recall-content").style.display = "none";
});
