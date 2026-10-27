

const API_URL = "https://dummyjson.com/products";


const elLoading = document.getElementById("loading");
const elError = document.getElementById("error");
const elDaftar = document.getElementById("daftarProduk");
const elJumlah = document.getElementById("jumlahProduk");
const elSearch = document.getElementById("searchProduk");
const btnReload = document.getElementById("btnReload");


let semuaProduk = [];


function formatHarga(angka) {
  return "$" + Number(angka).toFixed(2);
}


function setLoading(aktif) {
  elLoading.hidden = !aktif;
  btnReload.disabled = aktif;
}


function tampilkanError(pesan) {
  elError.textContent = pesan;
  elError.hidden = false;
}


function renderProduk(daftar) {
  elDaftar.innerHTML = ""; 

  if (daftar.length === 0) {
    const kosong = document.createElement("li");
    kosong.className = "empty-state";
    kosong.textContent = "Produk tidak ditemukan.";
    elDaftar.appendChild(kosong);
    elJumlah.textContent = "";
    return;
  }

  daftar.forEach((produk) => {
    const li = document.createElement("li");
    li.className = "product-card";

    const img = document.createElement("img");
    img.src = produk.thumbnail;
    img.alt = produk.title;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "product-body";

    const nama = document.createElement("h3");
    nama.className = "product-name";
    nama.textContent = produk.title;

    const kategori = document.createElement("span");
    kategori.className = "product-cat";
    kategori.textContent = produk.category;

    const harga = document.createElement("span");
    harga.className = "product-price";
    harga.textContent = formatHarga(produk.price);

    body.append(nama, kategori, harga);
    li.append(img, body);
    elDaftar.appendChild(li);
  });

  elJumlah.textContent = `Menampilkan ${daftar.length} dari ${semuaProduk.length} produk`;
}


async function ambilProduk() {
  elError.hidden = true;
  elDaftar.innerHTML = "";
  elJumlah.textContent = "";
  elSearch.disabled = true;
  setLoading(true);

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server mengembalikan status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.products)) {
      throw new Error("Format data dari server tidak sesuai.");
    }

    semuaProduk = data.products;
    renderProduk(semuaProduk);
    elSearch.disabled = false;
  } catch (err) {
    console.error("Gagal memuat produk:", err);
    tampilkanError(
      "Data produk gagal dimuat. Periksa koneksi internet lalu klik \"Muat ulang\". (" + err.message + ")"
    );
  } finally {
    setLoading(false);
  }
}



elSearch.addEventListener("input", () => {
  const kata = elSearch.value.trim().toLowerCase();
  const hasil = semuaProduk.filter((p) => p.title.toLowerCase().includes(kata));
  renderProduk(hasil);
});


btnReload.addEventListener("click", () => {
  elSearch.value = "";
  ambilProduk();
});


ambilProduk();