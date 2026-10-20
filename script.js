//  Variables 
var STORAGE_KEY = "mdSlidesData";

var defaultText =
  "# This is Slide 01\n## This is Heading 02 in slide 01\n\nThis is your content on slide 01\n---\n" +
  "# This is Slide 02\n## This is Heading 02 in slide 02\n\nThis is your content on slide 02\n---\n" +
  "# Slide 03\n\n- point one\n- point **two**\n- point *three*";

var input = document.getElementById("mdInput");
var previewSlide = document.getElementById("previewSlide");
var presentSlide = document.getElementById("presentSlide");
var presentation = document.getElementById("presentation");
var saveMsg = document.getElementById("saveMsg");

var slides = [];        // array of markdown text, one per slide
var current = 0;        // index of current slide
var presenting = false;

// Simple markdown to html
function escapeHtml(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// bold, italic, code, links inside one line
function inlineFormat(t) {
  t = escapeHtml(t);
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  return t;
}

function markdownToHtml(md) {
  var lines = md.split("\n");
  var html = "";
  var inList = false;
  var inCode = false;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    // code block ```
    if (line.trim().indexOf("```") === 0) {
      if (inCode) { html += "</code></pre>"; inCode = false; }
      else {
        if (inList) { html += "</ul>"; inList = false; }
        html += "<pre><code>"; inCode = true;
      }
      continue;
    }
    if (inCode) { html += escapeHtml(line) + "\n"; continue; }

    // list item
    var li = line.match(/^\s*[-*]\s+(.*)/);
    if (li) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += "<li>" + inlineFormat(li[1]) + "</li>";
      continue;
    }
    if (inList) { html += "</ul>"; inList = false; }

    // headings
    var h = line.match(/^(#{1,6})\s+(.*)/);
    if (h) {
      var level = h[1].length;
      html += "<h" + level + ">" + inlineFormat(h[2]) + "</h" + level + ">";
    } else if (line.trim() !== "") {
      html += "<p>" + inlineFormat(line) + "</p>";
    }
  }
  if (inList) html += "</ul>";
  if (inCode) html += "</code></pre>";
  return html;
}

// ---------- Slides logic ----------
function splitSlides() {
  // '---' on its own line separates slides
  var parts = input.value.split(/^\s*---\s*$/m);
  slides = [];
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].trim() !== "") slides.push(parts[i]);
  }
  if (slides.length === 0) slides.push("");
  if (current > slides.length - 1) current = slides.length - 1;
}

function showSlide() {
  var html = markdownToHtml(slides[current]);
  previewSlide.innerHTML = html;
  presentSlide.innerHTML = html;

  // counter on both screens
  var counters = document.querySelectorAll(".count");
  for (var i = 0; i < counters.length; i++) {
    counters[i].textContent = (current + 1) + " / " + slides.length;
  }

  // disable buttons on first and last slide
  var lefts = document.querySelectorAll('[data-action="left"]');
  var rights = document.querySelectorAll('[data-action="right"]');
  for (var j = 0; j < lefts.length; j++) {
    lefts[j].disabled = (current === 0);
    rights[j].disabled = (current === slides.length - 1);
  }
  updateFullButtons();
}

function goLeft() {
  if (current > 0) { current--; showSlide(); }
}
function goRight() {
  if (current < slides.length - 1) { current++; showSlide(); }
}

//  Full screen / presentation 
function updateFullButtons() {
  var btns = document.querySelectorAll(".fullBtn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].textContent = presenting ? "\u2716 Exit Full Screen" : "\u26F6 Full Screen";
  }
}

function startPresentation() {
  presenting = true;
  presentation.classList.remove("hidden");
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(function () {});
  }
  showSlide();
}

function stopPresentation() {
  presenting = false;
  presentation.classList.add("hidden");
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
  showSlide();
}

function toggleFull() {
  if (presenting) stopPresentation();
  else startPresentation();
}

// user presses Esc to leave fullscreen
document.addEventListener("fullscreenchange", function () {
  if (!document.fullscreenElement && presenting) {
    presenting = false;
    presentation.classList.add("hidden");
    showSlide();
  }
});

//  Save / Load (localStorage) 
function saveSlides() {
  localStorage.setItem(STORAGE_KEY, input.value);
  saveMsg.textContent = "Saved!";
  setTimeout(function () { saveMsg.textContent = ""; }, 1500);
}

function loadSlides() {
  var saved = localStorage.getItem(STORAGE_KEY);
  input.value = (saved !== null) ? saved : defaultText;
}

//  Events 
input.addEventListener("input", function () {
  splitSlides();
  showSlide();
});

document.getElementById("saveBtn").addEventListener("click", saveSlides);
document.getElementById("presentBtn").addEventListener("click", startPresentation);

var allButtons = document.querySelectorAll("[data-action]");
for (var i = 0; i < allButtons.length; i++) {
  allButtons[i].addEventListener("click", function () {
    var action = this.getAttribute("data-action");
    if (action === "left") goLeft();
    else if (action === "right") goRight();
    else if (action === "full") toggleFull();
  });
}

document.addEventListener("keydown", function (e) {
  var typing = (document.activeElement === input);

  // Ctrl+S
  if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
    e.preventDefault();
    saveSlides();
    return;
  }
  // F11
  if (e.key === "F11") {
    e.preventDefault();
    toggleFull();
    return;
  }
  // arrow keys (not while typing in the textarea)
  if (!typing || presenting) {
    if (e.key === "ArrowRight") { e.preventDefault(); goRight(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goLeft(); }
  }
});

// Start 
loadSlides();
splitSlides();
showSlide();
