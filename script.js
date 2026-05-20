// ================================
// SHORTCUT: CTRL + S
// ================================
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    document.querySelector("#saveDialog").showModal();
  }
});

// ================================
// ELEMENT REFERENCES
// ================================
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const toggleBtn = document.querySelector("#previewBtn");

const fileOpener = document.getElementById("fileOpener");
const openBtn = document.getElementById("openBtn");

const saveDialog = document.getElementById("saveDialog");
const fileNameInput = document.getElementById("fileNameInput");
const confirmSave = document.getElementById("confirmSave");

const chars = document.getElementById("chars");

let currentFileName = "untitled.txt";

// ================================
// LOCAL STORAGE AUTOSAVE
// ================================

// Load saved content
const savedContent = localStorage.getItem("web-notepad-content");

if (savedContent !== null) {
  editor.value = savedContent;
}

// Save while typing
editor.addEventListener("input", () => {
  localStorage.setItem(
    "web-notepad-content",
    editor.value,
  );

  // Character count update
  chars.innerText = editor.value.replace(/\s/g, "").length;
});

// Initial character count
chars.innerText = editor.value.replace(/\s/g, "").length;

// ================================
// SPELLCHECK TOGGLE
// ================================
document
  .querySelector("#spellCheck")
  .addEventListener("change", function () {
    editor.spellcheck = this.checked;
  });

// ================================
// MARKDOWN PREVIEW TOGGLE
// ================================
let previewMode = false;

toggleBtn.addEventListener("click", () => {
  previewMode = !previewMode;

  if (previewMode) {
    preview.innerHTML = marked.parse(editor.value);

    editor.hidden = true;
    preview.hidden = false;

    toggleBtn.textContent = "Edit Mode";
  } else {
    editor.hidden = false;
    preview.hidden = true;

    toggleBtn.textContent = "Preview Markdown";
  }
});

// ================================
// FILE OPEN LOGIC
// ================================
openBtn.addEventListener("click", () => {
  fileOpener.click();
});

fileOpener.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  currentFileName = file.name;
  fileNameInput.value = currentFileName;

  const reader = new FileReader();

  reader.onload = function (event) {
    editor.value = event.target.result;

    // Save opened file into localStorage too
    localStorage.setItem(
      "web-notepad-content",
      editor.value,
    );

    chars.innerText = editor.value.replace(
      /\s/g,
      "",
    ).length;
  };

  reader.readAsText(file);

  // allow reopening same file
  fileOpener.value = "";
});

// ================================
// SAVE LOGIC
// ================================
confirmSave.addEventListener("click", (e) => {
  e.preventDefault();

  let fileName = fileNameInput.value.trim();

  if (!fileName) {
    fileName = currentFileName;
  }

  const content = editor.value;

  try {
    // Main download method
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.style.display = "none";
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);

    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);

    currentFileName = fileName;
  } catch (err) {
    // Fallback if download fails
    alert(
      "Download failed. Your notes are still safely stored offline in localStorage.",
    );

    console.error(err);
  }

  saveDialog.close();
});

// ================================
// SAVE BUTTON CLICK
// ================================
document
  .querySelector("#infoBar > :last-child")
  .addEventListener("click", () => {
    saveDialog.showModal();
  });

// ================================
// MOBILE DETECTION
// ================================
function isMobilePhone() {
  return /iPhone|Android.+Mobile|Windows Phone/i.test(
    navigator.userAgent,
  );
}

if (isMobilePhone()) {
  console.log("Phone user detected.");

  const randNum = Math.floor(Math.random() * 2) + 1;

  if (randNum === 1) {
    alert(
      "Landscape Mode is recommended for mobile devices",
    );
  }
}
