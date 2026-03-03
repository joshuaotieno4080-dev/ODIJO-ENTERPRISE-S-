const sheetID = "https://script.google.com/macros/s/AKfycbyYfmEBEOIU8fvlm-K1BvbSokHjn4Ld-Ocs3tNWx_CEL2DykeNjVSZ1nFZu7yyvlC99/exec";
const sheetName = "odijo enterprise"; // name of sheet
const whatsappNumber = "254700238274"; // replace with your number

const productsContainer = document.getElementById("products");
let allProducts = [];

// Fetch products from Google Sheet
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

fetch(url)
  .then(res => res.text())
  .then(data => {
    const jsonData = JSON.parse(data.substr(47).slice(0, -2));
    const rows = jsonData.table.rows;

    allProducts = rows.map(row => ({
      name: row.c[0]?.v || "No Name",       // column 1 = Name
      price: row.c[1]?.v || "0",            // column 2 = Price
      image: row.c[2]?.v || "",             // column 3 = Image URL
      category: row.c[3]?.v || "Other"      // column 4 = Category
    }));

    displayProducts("Bitepoint"); // default category
  })
  .catch(err => console.error("Error fetching products:", err));

// Display products by category
function displayProducts(category) {
  productsContainer.innerHTML = "";
  allProducts
    .filter(p => p.category === category)
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h2>${p.name}</h2>
        <p>Ksh ${p.price}</p>
        <a class="whatsapp-btn" href="https://wa.me/${whatsappNumber}?text=Hi,%20I%20want%20to%20order%20${encodeURIComponent(p.name)}" target="_blank">Order via WhatsApp</a>
      `;
      productsContainer.appendChild(card);
    });
}

// Category buttons
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    displayProducts(btn.dataset.category);
  });
});
