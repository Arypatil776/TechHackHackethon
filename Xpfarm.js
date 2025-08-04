const matchPairs = {
  "WORD 1": "MATCH 1",
  "WORD 2": "MATCH 2",
  "WORD 3": "MATCH 3",
  "WORD 4": "MATCH 4",
  "WORD 5": "MATCH 5"
};

let selectedWord = null;
let matched = {};
let xp = 0;
let maxXP = 5;
let heartsLeft = 3;

// DOM references
const wordButtons = document.querySelectorAll(".word");
const matchButtons = document.querySelectorAll(".match");
const progress = document.querySelector(".progress");
const hearts = document.querySelectorAll(".heart");

// === Match logic ===
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
  const percentage = Math.min((xp / maxXP) * 100, 100);
  progress.style.width = `${percentage}%`;
}

function fadeHeart() {
  if (heartsLeft <= 0) return;

  heartsLeft--;
  hearts[heartsLeft].style.color = "#4b004b";

  if (heartsLeft === 0) {
    showGameOverMessage();
  }
}

function showGameOverMessage() {
  const msgBox = document.createElement("div");
  msgBox.innerHTML = `<div class="game-over-box">
    <h2>All hearts lost 💔</h2>
    <p>Please refresh the page to try again.</p>
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

  document.body.appendChild(msgBox);
}

// === Sidebar toggle and blur effect ===
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

// === Tab Switching Logic ===
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

learnTab.addEventListener("click", () => switchTab(learnTab, learnSection));
xpfarmTab.addEventListener("click", () => switchTab(xpfarmTab, xpfarmSection));
recallTab.addEventListener("click", () => switchTab(recallTab, recallSection));

function speak(button, word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'de-DE';
  speechSynthesis.speak(utterance);

  // Animate voice lines
  button.classList.add("active");
  utterance.onend = () => {
    button.classList.remove("active");
  };
}


recallTab.addEventListener("click", () => {
  switchTab(recallTab, recallSection);
  document.getElementById("recall-content").style.display = "block";
});

learnTab.addEventListener("click", () => {
  switchTab(learnTab, learnSection);
  document.getElementById("recall-content").style.display = "none";
});

xpfarmTab.addEventListener("click", () => {
  switchTab(xpfarmTab, xpfarmSection);
  document.getElementById("recall-content").style.display = "none";
});
