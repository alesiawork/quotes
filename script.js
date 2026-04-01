const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", tag: "Work" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", tag: "Resilience" },
  { text: "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.", author: "Charles Darwin", tag: "Adaptability" },
  { text: "The unexamined life is not worth living.", author: "Socrates", tag: "Philosophy" },
  { text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", author: "Albert Einstein", tag: "Creativity" },
  { text: "I think, therefore I am.", author: "René Descartes", tag: "Philosophy" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", tag: "Resilience" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson", tag: "Individuality" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost", tag: "Life" },
  { text: "Not everything that is faced can be changed, but nothing can be changed until it is faced.", author: "James Baldwin", tag: "Courage" },
  { text: "The mind is everything. What you think you become.", author: "Buddha", tag: "Mindset" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", tag: "Learning" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", tag: "Wisdom" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson", tag: "Courage" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", tag: "Life" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", tag: "Discipline" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", tag: "Action" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", tag: "Persistence" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", tag: "Courage" },
  { text: "What we know is a drop, what we don't know is an ocean.", author: "Isaac Newton", tag: "Humility" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey", tag: "Growth" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", tag: "Happiness" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", tag: "Action" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford", tag: "Mindset" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison", tag: "Persistence" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", tag: "Action" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", tag: "Wisdom" },
  { text: "One child, one teacher, one book, one pen can change the world.", author: "Malala Yousafzai", tag: "Education" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", tag: "Purpose" },
  { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama", tag: "Happiness" },
];

const textEl = document.getElementById("quote-text");
const authorEl = document.getElementById("quote-author");
const tagEl = document.getElementById("quote-tag");
const newBtn = document.getElementById("new-quote");
const copyBtn = document.getElementById("copy-quote");
const prevBtn = document.getElementById("prev-quote");
const historyBtn = document.getElementById("toggle-history");
const historyPanel = document.getElementById("history-panel");
const historyList = document.getElementById("history-list");
const themeBtn = document.getElementById("theme-toggle");
const swatchesEl = document.getElementById("swatches");
const filtersEl = document.getElementById("filters");

let activeFilter = "All";
let lastIndex = -1;
let currentQuote = null;
const quoteHistory = [];
let historyPos = -1;

function applyMode(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  themeBtn.textContent = mode === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}";
  localStorage.setItem("quote-mode", mode);
}

themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyMode(current === "light" ? "dark" : "light");
});

applyMode(localStorage.getItem("quote-mode") || "dark");

function applyColor(color) {
  if (color === "indigo") {
    document.documentElement.removeAttribute("data-color");
  } else {
    document.documentElement.setAttribute("data-color", color);
  }
  swatchesEl.querySelectorAll(".swatch").forEach(s => {
    s.classList.toggle("active", s.dataset.color === color);
  });
  localStorage.setItem("quote-color", color);
}

swatchesEl.addEventListener("click", (e) => {
  const swatch = e.target.closest(".swatch");
  if (swatch) applyColor(swatch.dataset.color);
});

applyColor(localStorage.getItem("quote-color") || "indigo");

const tags = ["All", ...Array.from(new Set(quotes.map(q => q.tag))).sort()];

function buildFilters() {
  filtersEl.textContent = "";
  for (const tag of tags) {
    const pill = document.createElement("button");
    pill.className = "filter-pill" + (tag === activeFilter ? " active" : "");
    pill.textContent = tag;
    pill.addEventListener("click", () => {
      activeFilter = tag;
      buildFilters();
      showNewQuote();
    });
    filtersEl.appendChild(pill);
  }
}

buildFilters();

function getFiltered() {
  if (activeFilter === "All") return quotes;
  return quotes.filter(q => q.tag === activeFilter);
}

function pickRandom() {
  const pool = getFiltered();
  if (pool.length === 0) return null;
  if (pool.length === 1) return pool[0];
  let pick;
  do {
    pick = pool[Math.floor(Math.random() * pool.length)];
  } while (pick === currentQuote);
  return pick;
}

function displayQuote(q) {
  textEl.classList.add("fade-out");
  authorEl.classList.add("fade-out");
  tagEl.classList.add("fade-out");

  setTimeout(() => {
    if (!q) {
      textEl.textContent = "No quotes in this category.";
      authorEl.textContent = "";
      tagEl.textContent = "";
      currentQuote = null;
    } else {
      currentQuote = q;
      textEl.textContent = q.text;
      authorEl.textContent = q.author;
      tagEl.textContent = q.tag;
    }
    textEl.classList.remove("fade-out");
    authorEl.classList.remove("fade-out");
    tagEl.classList.remove("fade-out");
    updatePrevBtn();
    renderHistory();
  }, 350);
}

function showNewQuote() {
  const q = pickRandom();
  if (q) {
    if (historyPos < quoteHistory.length - 1) {
      quoteHistory.splice(historyPos + 1);
    }
    quoteHistory.push(q);
    historyPos = quoteHistory.length - 1;
  }
  displayQuote(q);
}

function goBack() {
  if (historyPos > 0) {
    historyPos--;
    displayQuote(quoteHistory[historyPos]);
  }
}

function goToHistoryItem(idx) {
  historyPos = idx;
  displayQuote(quoteHistory[historyPos]);
}

function updatePrevBtn() {
  prevBtn.disabled = historyPos <= 0;
  prevBtn.style.opacity = historyPos <= 0 ? "0.4" : "1";
}

function renderHistory() {
  historyList.textContent = "";
  for (let i = quoteHistory.length - 1; i >= 0; i--) {
    const q = quoteHistory[i];
    const li = document.createElement("li");
    li.className = "history-item" + (i === historyPos ? " current" : "");

    const textSpan = document.createElement("span");
    textSpan.className = "history-item-text";
    textSpan.textContent = q.text;

    const authorSpan = document.createElement("span");
    authorSpan.className = "history-item-author";
    authorSpan.textContent = q.author;

    li.appendChild(textSpan);
    li.appendChild(authorSpan);

    const idx = i;
    li.addEventListener("click", () => goToHistoryItem(idx));
    historyList.appendChild(li);
  }
}

historyBtn.addEventListener("click", () => {
  historyPanel.classList.toggle("hidden");
  renderHistory();
});

function copyQuote() {
  if (!currentQuote) return;
  const copyText = `"${currentQuote.text}" \u2014 ${currentQuote.author}`;
  navigator.clipboard.writeText(copyText).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => { copyBtn.textContent = original; }, 1500);
  });
}

newBtn.addEventListener("click", showNewQuote);
prevBtn.addEventListener("click", goBack);
copyBtn.addEventListener("click", copyQuote);

showNewQuote();
