const fileInput = document.querySelector("#resume-file");
const dropZone = document.querySelector("#drop-zone");
const dropTitle = document.querySelector("#drop-title");
const dropCaption = document.querySelector("#drop-caption");
const uploadMessage = document.querySelector("#upload-message");
const analyzeButton = document.querySelector("#analyze-button");
const reportTitle = document.querySelector("#report-title");
const reportBadge = document.querySelector("#report-badge");
const mockDisclaimer = document.querySelector("#mock-disclaimer");

let selectedFile = null;
let hasMockResult = false;

function showUploadError(message) {
  uploadMessage.textContent = message;
  uploadMessage.classList.add("is-error");
  analyzeButton.disabled = true;
  selectedFile = null;
}

function setSelectedFile(file) {
  if (!file) return;

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    showUploadError("That file isn’t a PDF. Please choose a PDF to continue.");
    fileInput.value = "";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showUploadError("That PDF is over 10 MB. Please choose a smaller file.");
    fileInput.value = "";
    return;
  }

  selectedFile = file;
  hasMockResult = false;
  uploadMessage.textContent = "";
  uploadMessage.classList.remove("is-error");
  dropTitle.textContent = file.name;
  dropCaption.textContent = "Ready when you are";
  analyzeButton.disabled = false;
  analyzeButton.classList.remove("is-loading");
  analyzeButton.innerHTML = 'Check my resume <span aria-hidden="true">→</span>';
}

fileInput.addEventListener("change", () => {
  setSelectedFile(fileInput.files[0]);
});

dropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fileInput.click();
  }
});

for (const eventName of ["dragenter", "dragover"]) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
  });
}

for (const eventName of ["dragleave", "drop"]) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
  });
}

dropZone.addEventListener("drop", (event) => {
  setSelectedFile(event.dataTransfer.files[0]);
});

analyzeButton.addEventListener("click", () => {
  if (!selectedFile) return;
  if (hasMockResult) {
    fileInput.click();
    return;
  }

  analyzeButton.disabled = true;
  analyzeButton.classList.add("is-loading");
  analyzeButton.innerHTML = 'Putting your snapshot together <span aria-hidden="true">→</span>';

  window.setTimeout(() => {
    reportTitle.textContent = "Your snapshot is ready.";
    reportBadge.textContent = "MOCK RESULT";
    mockDisclaimer.innerHTML =
      '<span aria-hidden="true">✳</span> Demo only: “' +
      escapeHtml(selectedFile.name) +
      '” wasn’t parsed. This sample score and skill list aren’t based on your PDF.';
    uploadMessage.textContent = "Demo preview ready for " + selectedFile.name;
    uploadMessage.classList.remove("is-error");
    analyzeButton.classList.remove("is-loading");
    analyzeButton.innerHTML = 'Check another resume <span aria-hidden="true">→</span>';
    analyzeButton.disabled = false;
    hasMockResult = true;
  }, 650);
});

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}
