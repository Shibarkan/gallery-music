// edit hapus
const selectModeBtn = document.getElementById("selectModeBtn");
const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
const selectionInfo = document.getElementById("selectionInfo");
const confirmDeleteModal = document.getElementById("confirmDeleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let isSelectMode = false;
let selectedIndexes = new Set();

// Toggle Mode Pilih
selectModeBtn.addEventListener("click", () => {
  isSelectMode = !isSelectMode;
  selectedIndexes.clear();
  // disable
  addButton.disabled = isSelectMode;
  if (isSelectMode) {
    addButton.classList.add(
      "opacity-50",
      "cursor-not-allowed",
      "pointer-events-none"
    );
  } else {
    addButton.classList.remove(
      "opacity-50",
      "cursor-not-allowed",
      "pointer-events-none"
    );
  }

  document.querySelectorAll(".photo-item").forEach((div, index) => {
    div.classList.remove(
      "ring",
      "ring-pink-500",
      "scale-95",
      "brightness-75",
      "wiggle"
    );

    if (isSelectMode) {
      div.classList.add("wiggle"); // tambahkan goyang
      div.addEventListener(
        "click",
        (div._selectHandler = () => toggleSelect(div, index))
      );
    } else {
      div.removeEventListener("click", div._selectHandler);
    }
  });

  deleteSelectedBtn.classList.toggle("hidden", !isSelectMode);
  if (isSelectMode) {
    selectionInfo.classList.remove("hidden");
    selectionInfo.classList.remove("slide-in-boing"); // reset animasi
    void selectionInfo.offsetWidth; // trigger reflow agar animasi bisa diulang
    selectionInfo.classList.add("slide-in-boing");
  } else {
    selectionInfo.classList.add("hidden");
  }

  const icon = selectModeBtn.querySelector("img");
  icon.src = isSelectMode ? "images/close.png" : "images/select.png";
});

// Fungsi Pilih
function toggleSelect(div, index) {
  if (selectedIndexes.has(index)) {
    selectedIndexes.delete(index);
    div.classList.remove("ring", "ring-pink-300", "scale-95", "brightness-75");
  } else {
    selectedIndexes.add(index);
    div.classList.add("ring", "ring-pink-300", "scale-95", "brightness-75");

    if (!selectionInfo.classList.contains("hidden")) {
      selectionInfo.classList.add("hidden");
    }
  }

  if (selectedIndexes.size === 0 && isSelectMode) {
    selectionInfo.classList.remove("hidden");
  }
}

// Tampilkan Modal Konfirmasi saat Klik Hapus
deleteSelectedBtn.addEventListener("click", () => {
  if (selectedIndexes.size > 0) {
    confirmDeleteModal.classList.remove("hidden");
  }
});

// Konfirmasi Hapus
confirmDeleteBtn.addEventListener("click", () => {
  const data = getData().filter((_, i) => !selectedIndexes.has(i));
  saveData(data);
  isSelectMode = false;
  selectedIndexes.clear();
  renderGallery();
  addButton.disabled = false;
  addButton.classList.remove(
    "opacity-50",
    "cursor-not-allowed",
    "pointer-events-none"
  );
  confirmDeleteModal.classList.add("hidden");
  deleteSelectedBtn.classList.add("hidden");
  selectionInfo.classList.add("hidden");

  const icon = selectModeBtn.querySelector("img");
  icon.src = "images/select.png";
});

// Batal Hapus
cancelDeleteBtn.addEventListener("click", () => {
  confirmDeleteModal.classList.add("hidden");
});
