
const form = document.getElementById("formDaftar");
const inNama = document.getElementById("nama");
const inEmail = document.getElementById("email");
const inPassword = document.getElementById("password");
const inUmur = document.getElementById("umur");
const inKategori = document.getElementById("kategori");
const inBio = document.getElementById("bio");
const inSetuju = document.getElementById("setuju");

const btnToggle = document.getElementById("togglePassword");
const btnReset = document.getElementById("btnReset");
const bioCounter = document.getElementById("bioCounter");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const hasil = document.getElementById("hasil");


function setError(input, errorId, pesan) {
  const el = document.getElementById(errorId);
  el.textContent = pesan;
  if (input.type !== "checkbox") {
    input.classList.toggle("invalid", pesan !== "");
    input.classList.toggle("valid", pesan === "");
  }
  return pesan === "";
}


function validasiNama() {
  const v = inNama.value.trim();
  if (v === "") return setError(inNama, "namaError", "Nama wajib diisi.");
  if (v.length < 3) return setError(inNama, "namaError", "Nama minimal 3 karakter.");
  if (!/^[A-Za-z\s.'-]+$/.test(v)) return setError(inNama, "namaError", "Nama hanya boleh berisi huruf.");
  return setError(inNama, "namaError", "");
}

function validasiEmail() {
  const v = inEmail.value.trim();
  const pola = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (v === "") return setError(inEmail, "emailError", "Email wajib diisi.");
  if (!pola.test(v)) return setError(inEmail, "emailError", "Format email tidak valid.");
  return setError(inEmail, "emailError", "");
}

function validasiPassword() {
  const v = inPassword.value;
  if (v === "") return setError(inPassword, "passwordError", "Password wajib diisi.");
  if (v.length < 8) return setError(inPassword, "passwordError", "Password minimal 8 karakter.");
  if (!/\d/.test(v) || !/[A-Za-z]/.test(v))
    return setError(inPassword, "passwordError", "Password harus mengandung huruf dan angka.");
  return setError(inPassword, "passwordError", "");
}

function validasiUmur() {
  const v = inUmur.value;
  if (v === "") return setError(inUmur, "umurError", "Umur wajib diisi.");
  const n = Number(v);
  if (!Number.isInteger(n) || n < 17 || n > 60)
    return setError(inUmur, "umurError", "Umur harus berupa angka 17 - 60.");
  return setError(inUmur, "umurError", "");
}

function validasiKategori() {
  if (inKategori.value === "") return setError(inKategori, "kategoriError", "Pilih salah satu kategori.");
  return setError(inKategori, "kategoriError", "");
}

function validasiSetuju() {
  return setError(inSetuju, "setujuError", inSetuju.checked ? "" : "Anda harus menyetujui syarat dan ketentuan.");
}

// ----- Event: validasi realtime -----
inNama.addEventListener("input", validasiNama);
inEmail.addEventListener("input", validasiEmail);
inUmur.addEventListener("input", validasiUmur);
inKategori.addEventListener("change", validasiKategori);
inSetuju.addEventListener("change", validasiSetuju);


inPassword.addEventListener("input", () => {
  validasiPassword();
  updateKekuatan(inPassword.value);
});

function updateKekuatan(pw) {
  let skor = 0;
  if (pw.length >= 8) skor++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) skor++;
  if (/\d/.test(pw)) skor++;
  if (/[^A-Za-z0-9]/.test(pw)) skor++;

  const level = [
    { teks: "-", lebar: "0%", warna: "transparent" },
    { teks: "Lemah", lebar: "25%", warna: "#c0392b" },
    { teks: "Cukup", lebar: "50%", warna: "#e8a317" },
    { teks: "Kuat", lebar: "75%", warna: "#5aa469" },
    { teks: "Sangat kuat", lebar: "100%", warna: "#1e8449" },
  ];
  const l = pw === "" ? level[0] : level[Math.max(skor, 1)];
  strengthBar.style.width = l.lebar;
  strengthBar.style.background = l.warna;
  strengthText.textContent = "Kekuatan password: " + l.teks;
}


btnToggle.addEventListener("click", () => {
  const tersembunyi = inPassword.type === "password";
  inPassword.type = tersembunyi ? "text" : "password";
  btnToggle.textContent = tersembunyi ? "Sembunyikan" : "Lihat";
});


inBio.addEventListener("input", () => {
  bioCounter.textContent = `${inBio.value.length} / ${inBio.maxLength} karakter`;
});


form.addEventListener("submit", (e) => {
  e.preventDefault(); 

 
  const hasilValidasi = [
    validasiNama(),
    validasiEmail(),
    validasiPassword(),
    validasiUmur(),
    validasiKategori(),
    validasiSetuju(),
  ];

  if (hasilValidasi.includes(false)) {
    tampilkanGagal();
    return;
  }

  tampilkanBerhasil({
    nama: inNama.value.trim(),
    email: inEmail.value.trim(),
    umur: inUmur.value,
    kategori: inKategori.value,
    bio: inBio.value.trim(),
  });
});

function tampilkanBerhasil(data) {
  hasil.className = "result filled";
  hasil.innerHTML = ""; 

  const judul = document.createElement("h3");
  judul.textContent = `Pendaftaran berhasil, ${data.nama.split(" ")[0]}!`;

  const dl = document.createElement("dl");
  const baris = [
    ["Nama", data.nama],
    ["Email", data.email],
    ["Umur", data.umur + " tahun"],
    ["Kategori", data.kategori],
    ["Tentang", data.bio || "-"],
    ["Waktu", new Date().toLocaleString("id-ID")],
  ];
  baris.forEach(([label, isi]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = isi; 
    dl.append(dt, dd);
  });

  hasil.append(judul, dl);
}

function tampilkanGagal() {
  hasil.className = "result";
  hasil.innerHTML = "";
  const p = document.createElement("p");
  p.style.color = "#c0392b";
  p.textContent = "Form belum valid. Periksa kembali kolom yang bertanda merah.";
  hasil.appendChild(p);
}


function resetTampilan() {
  [inNama, inEmail, inPassword, inUmur, inKategori].forEach((el) => el.classList.remove("valid", "invalid"));
  document.querySelectorAll(".error-msg").forEach((el) => (el.textContent = ""));
  inPassword.type = "password";
  btnToggle.textContent = "Lihat";
  updateKekuatan("");
  bioCounter.textContent = `0 / ${inBio.maxLength} karakter`;
  hasil.className = "result";
  hasil.innerHTML = '<p class="result-empty">Hasil pendaftaran akan tampil di sini setelah form berhasil dikirim.</p>';
}

btnReset.addEventListener("click", () => {
  form.reset();
  resetTampilan();
});