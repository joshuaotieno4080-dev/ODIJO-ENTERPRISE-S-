// ==========================
// CONFIGURATION
// ==========================
const sheetID = "https://script.google.com/macros/s/AKfycbyYfmEBEOIU8fvlm-K1BvbSokHjn4Ld-Ocs3tNWx_CEL2DykeNjVSZ1nFZu7yyvlC99/exec";   // <-- Replace with your Sheet ID
const sheetName = "odijo enterprise products";        // Change if your sheet name is different
const whatsappNumber = "254700 238274"; // <-- Replace with your WhatsApp number (no +)

// ==========================
// FETCH GOOGLE SHEET DATA
// ==========================
const productsContainer = document.getElementById("products");
let allProducts = [];

const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

fetch(url)
  .then(res => res.text())
  .then(data => {
    const jsonData = JSON.parse(data.substr(47).slice(0, -2));
    const rows = jsonData.table.rows;

    allProducts = rows.map(row => {
      const name = row.c[0]?.v || "No Name";     // Column 1 = Name
      const price = row.c[1]?.v || "0";          // Column 2 = Price
      const rawImage = row.c[2]?.v || "";        // Column 3 = Image URL
      const category = row.c[3]?.v || "Other";   // Column 4 = Category

      // ==========================
      // AUTO CONVERT DRIVE LINKS
      // ==========================
      let image = rawImage;

      if (rawImage.includes("drive.google.com")) {
        const match = rawImage.match(/\/d\/(.*?)\//);
        if (match && match[1]) {
          image = `https://drive.google.com/uc?export=view&id=${match[1]}`;
        }
      }

      return { name, price, image, category };
    });

    displayProducts("Bitepoint"); // Default category
  })
  .catch(error => console.error("Error fetching sheet:", error));


// ==========================
// DISPLAY PRODUCTS
// ==========================
function displayProducts(category) {
  productsContainer.innerHTML = "";

  const filtered = allProducts.filter(p => p.category === category);

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>Ksh ${product.price}</p>
      <a class="whatsapp-btn"
         href="https://wa.me/${whatsappNumber}?text=Hi,%20I%20want%20to%20order%20${encodeURIComponent(product.name)}"
         target="_blank">
         Order via WhatsApp
      </a>
    `;

    productsContainer.appendChild(card);
  });
}


// ==========================
// CATEGORY BUTTONS
// ==========================
document.querySelectorAll(".category-btn").forEach(button => {
  button.addEventListener("click", () => {
    displayProducts(button.dataset.category);
  });
});
