// Buat userCode jika belum ada
let userCode = localStorage.getItem("user_code");
if (!userCode) {
  userCode = Math.random().toString(36).substring(2, 8);
  localStorage.setItem("user_code", userCode);
}

const gallery = document.getElementById("gallery");
const addButton = document.getElementById("addButton");
const uploadModal = document.getElementById("uploadModal");
const closeModal = document.getElementById("closeModal");
const uploadForm = document.getElementById("uploadForm");
const photoInput = document.getElementById("photoInput");
const captionInput = document.getElementById("captionInput");
const previewImage = document.getElementById("previewImage");
// Emot love terbang
function createLove() {
  const img = document.createElement("img");
  img.src = "images/love.png"; // love
  img.className = "love";
  img.style.left = Math.random() * window.innerWidth + "px";
  img.style.animationDuration = 2 + Math.random() * 3 + "s";
  img.style.transform = `rotate(${Math.random() * 360}deg) scale(${
    0.6 + Math.random() * 0.8
  })`;
  document.body.appendChild(img);
  setTimeout(() => img.remove(), 5000);
}

// Loop terus-menerus
setInterval(createLove, 400);

// Ambil dan simpan data lokal
function getData() {
  return JSON.parse(localStorage.getItem("photos") || "[]");
}
function saveData(data) {
  localStorage.setItem("photos", JSON.stringify(data));
}

// Acak gaya
function randomTransform() {
  const rotations = [-8, -4, 0, 4, 8];
  const yOffset = [-1, 0, 1];
  return `rotate(${
    rotations[Math.floor(Math.random() * rotations.length)]
  }deg) translateY(${yOffset[Math.floor(Math.random() * yOffset.length)]}rem)`;
}

// Tampilkan galeri
function renderGallery() {
  gallery.innerHTML = "";
  const data = getData();

  data.forEach((item, index) => {
    setTimeout(() => {
      const div = document.createElement("div");
      div.className =
        "photo-item relative bg-white rounded shadow-md p-2 transform opacity-0 translate-y-10";
      div.style.transform += " " + randomTransform();

      // Gambar
      const img = document.createElement("img");
      img.src = item.url;
      img.alt = "kenangan";
      img.className = "w-full h-60 object-cover rounded";

      // Caption
      const caption = document.createElement("p");
      caption.className = "text-sm text-gray-600";
      caption.textContent = item.caption;

      // Tombol Edit
      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️ Edit";
      editBtn.className = "text-xs text-blue-500 hover:underline ml-2";
      editBtn.onclick = () => {
        const newCaption = prompt("Edit keterangan:", item.caption);
        if (newCaption !== null) {
          item.caption = newCaption;
          const current = getData();
          current[index].caption = newCaption;
          saveData(current);
          renderGallery();
          setAddButtonState(true); // bisa tambah foto

        }
      };

      // Bungkus caption dan tombol edit
      const captionWrapper = document.createElement("div");
      captionWrapper.className = "flex items-center justify-between mt-2";
      captionWrapper.appendChild(caption);
      captionWrapper.appendChild(editBtn);

      // Tanggal/waktu
      const time = document.createElement("p");
      time.className = "text-xs text-right text-gray-400";
      time.textContent = new Date(item.date).toLocaleString();

      // Susun elemen
      div.appendChild(img);
      div.appendChild(captionWrapper);
      div.appendChild(time);
      gallery.appendChild(div);

      // Animasi fade-in
      setTimeout(() => {
        div.classList.remove("opacity-0", "translate-y-10");
        div.classList.add("opacity-100", "translate-y-0");
      }, 50);
    }, index * 200);
  });
}

// Modal Upload
addButton.onclick = () => {
  if (isSelectMode) return; // Jangan buka modal jika sedang pilih
  uploadModal.classList.remove("hidden");
};

closeModal.onclick = () => uploadModal.classList.add("hidden");

uploadForm.onsubmit = (e) => {
  e.preventDefault();
  const file = photoInput.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const newItem = {
      url: reader.result,
      caption: captionInput.value,
      date: new Date().toISOString(),
    };

    // Simpan ke local
    const current = getData();
    current.push(newItem);
    saveData(current);
    renderGallery();

    // Kirim ke server
    fetch("http://localhost:3000/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: userCode, photo: newItem }),
    });

    uploadModal.classList.add("hidden");
    uploadForm.reset();
    previewImage.classList.add("hidden");
    previewImage.src = "";
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};

// Preview Gambar
photoInput.onchange = () => {
  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      previewImage.src = reader.result;
      previewImage.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  } else {
    previewImage.classList.add("hidden");
    previewImage.src = "";
  }
};

// Inisialisasi galeri awal
renderGallery();

function renderSharedGallery(data) {
  gallery.innerHTML = "";
  data.forEach((item) => {
    const div = document.createElement("div");
    div.className =
      "photo-item relative bg-white rounded shadow-md p-2 transform";
    div.style.transform += " " + randomTransform();

    const img = document.createElement("img");
    img.src = item.url;
    img.className = "w-full h-60 object-cover rounded";

    const caption = document.createElement("p");
    caption.className = "text-sm text-gray-600 mt-2";
    caption.textContent = item.caption;

    const time = document.createElement("p");
    time.className = "text-xs text-right text-gray-400";
    time.textContent = new Date(item.date).toLocaleString();

    div.appendChild(img);
    div.appendChild(caption);
    div.appendChild(time);
    gallery.appendChild(div);
    setAddButtonState(false); // nonaktifkan tambah foto

  });
}

// Tampilkan kode user ke input
document.addEventListener("DOMContentLoaded", () => {
  const myCodeInput = document.getElementById("myCodeDisplay");
  if (myCodeInput) {
    myCodeInput.value = userCode;
  }
});

document.getElementById("myCodeDisplay").value = userCode;

function copyMyCode() {
  const input = document.getElementById("myCodeDisplay");
  input.select();
  document.execCommand("copy");
  alert("Kode disalin ke clipboard!");
}

function joinCode() {
  const code = document.getElementById("inputKode").value.trim();
  if (!code) return alert("Kode tidak boleh kosong");

  fetch(`http://localhost:3000/api/gallery/${code}`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) return alert("Gallery tidak ditemukan atau kosong.");

      renderSharedGallery(data);
      document.getElementById("exitFriendGallery").classList.remove("hidden");
      showSuccessPopup();

      // 🔥 TUTUP MODAL jika akses dari dalam modal upload
      const modal = document.getElementById("uploadModal");
      if (modal && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
      }

    })
    .catch(err => alert("Gagal mengambil gallery: " + err));
}



function showSuccessPopup() {
  const popup = document.getElementById("popupSuccess");

  popup.classList.remove("opacity-0", "pointer-events-none", "scale-95");
  popup.classList.add("opacity-100", "scale-100");

  setTimeout(() => {
    popup.classList.remove("opacity-100", "scale-100");
    popup.classList.add("opacity-0", "pointer-events-none", "scale-95");
  }, 3000);
}

function exitGallery() {
  document.getElementById("exitFriendGallery").classList.add("hidden");
  renderGallery(); // kembali ke gallery sendiri
  setAddButtonState(true); // ✅ aktifkan kembali tombol tambah foto
}

function setAddButtonState(isEnabled) {
  const addBtn = document.getElementById("addButton");
  if (!addBtn) return;

  if (isEnabled) {
    addBtn.disabled = false;
    addBtn.classList.remove("opacity-50", "cursor-not-allowed", "pointer-events-none");
    addBtn.classList.add("hover:scale-110");
  } else {
    addBtn.disabled = true;
    addBtn.classList.add("opacity-50", "cursor-not-allowed", "pointer-events-none");
    addBtn.classList.remove("hover:scale-110");
  }
}


