const productList = [
{
    "name": "Jogger Shorts Brown",
   
    "category": ["MEN", "SHORTS"],
    "price": 20.32,
    "original": 67.72,
    "discount": "-70%",
    "img": "clothing/zara_shortsbr.jpg"
  },
  {
    "name": "Running Jacket",
    "category": ["MEN","OUTERWEAR"],
    "price": 39.3,
    "original": 87.34,
    "discount": "-55%",
    "img": "clothing/zara_jck.jpg"
  },
  {
    "name": "Jogger Shorts Black",
    "category": ["MEN","SHORTS"],
    "price": 29.19,
    "original": 69.51,
    "discount": "-57%",
    "img": "clothing/zara_shortsb.jpg"
  },
  {
    "name": "Running Shoes Black",
    "category": ["MEN","OUTERWEAR"],
    "price": 50.98,
    "original": 105.20,
    "discount": "-51.5%",
    "img": "clothing/zara_sh.jpg"
  },
  {
    "name": "Running Shoes Brown",
    "category": ["WOMEN","OUTERWEAR"],
    "price": 50.98,
    "original": 105.20,
    "discount": "-51.5%",
    "img": "clothing/women_sneBR.png"
  },
  {
    "name": "Running Shirt Purple",
    "category": ["MEN","T-SHIRTS"],
    "price": 29.57,
    "original": 89.6,
    "discount": "-67%",
    "img": "clothing/zara_purple.jpg"
  },
  {
    "name": "Jogger Sweatpants Brown",
    "category": ["PANTS","MEN"],
    "price": 34.84,
    "original": 82.95,
    "discount": "-57%",
    "img": "clothing/zara_brown.jpg"
  },
  {
    "name": "Running Shirt Light Brown",
    "category": ["MEN","T-SHIRTS"],
    "price": 23.55,
    "original": 71.35,
    "discount": "-67%",
    "img": "clothing/zara_br.jpg"
  },
  {
    "name": "Compression Shorts Black ",
    "category":["MEN","SHORTS"],
    "price": 21.18,
    "original": 70.59,
    "discount": "-70%",
    "img": "clothing/zara_bl.jpg"
  },
  {
    "name": "Hiking Backpack",
    "category": ["MEN","OUTERWEAR"],
    "price": 25.51,
    "original": 72.88,
    "discount": "-65%",
    "img": "clothing/zara_bck.jpg"
  },
  {
    "name": "Tank Brown",
    "category": ["WOMEN","T-SHIRTS"],
    "price": 36.47,
    "original": 86.83,
    "discount": "-57%",
    "img": "clothing/women_tnkbr.png"
  },
  {
    "name": "Jogger Shorts Black",
    "category": ["WOMEN","SHORTS"],
    "price": 27.11,
    "original": 67.77,
    "discount": "-60%",
    "img": "clothing/women_shbl.png"
  },
  {
    "name": "Jogger Shorts Pink",
    "category": ["WOMEN","SHORTS"],
    "price": 28.04,
    "original": 84.96,
    "discount": "-67%",
    "img": "clothing/women_pnk.png"
  },
  {
    "name": "Pleated Skort",
    "category": ["WOMEN","SKIRTS"],
    "price": 14.43,
    "original": 41.23,
    "discount": "-65%",
    "img": "clothing/women_plbr.png"
  },
  {
    "name": "Brown Skort",
    "category": ["WOMEN","SKIRTS"],
    "price": 17.07,
    "original": 42.68,
    "discount": "-60%",
    "img": "clothing/women_brsk.png"
  },
  {
    "name": "Running Shirt Brown",
    "category": ["WOMEN","T-SHIRTS"],
    "price": 17.03,
    "original": 42.57,
    "discount": "-60%",
    "img": "clothing/women_br.png"
  },
  {
    "name": "Jogger Shorts Black",
    "category": ["WOMEN","SHORTS"],
    "price": 16.74,
    "original": 47.84,
    "discount": "-65%",
    "img": "clothing/women_blsh.png"
  },
  {
    "name": "Womens Athletic Bundle",
    "category": ["WOMEN","OUTERWEAR","T-SHIRTS","PANTS","SHORTS","HOODIES"],
    "price": 75,
    "original": 250.00,
    "discount": "-70%",
    "img": "clothing/women_bndle.png"
  },
  {
    "name": "Black Skort",
    "category": ["WOMEN","SKIRTS"],
    "price": 35.91,
    "original": 85.51,
    "discount": "-57%",
    "img": "clothing/women_blsk.png"
  },
  {
    "name": "Running T-Shirt Black",
    "category": ["WOMEN","T-SHIRTS"],
    "price": 36.24,
    "original": 86.29,
    "discount": "-57%",
    "img": "clothing/women_blshr.png"
  },
  {
    "name": "Running T-Shirt Blue",
    "category": ["WOMEN","T-SHIRTS"],
    "price": 36.24,
    "original": 86.29,
    "discount": "-57%",
    "img": "clothing/women_bl.png"
  },
  {
    "name": "Pullover Hoodie Purple",
    "category": ["WOMEN","HOODIES"],
    "price": 21.48,
    "original": 61.36,
    "discount": "-65%",
    "img": "clothing/women_purpH.png"
  },
  {
    "name": "Pullover Hoodie Green",
    "category": ["WOMEN","HOODIES"],
    "price": 21.48,
    "original": 61.36,
    "discount": "-65%",
    "img": "clothing/women_greenH.png"
  },
  {
    "name": "Hoodie Light Brown",
    "category": ["MEN","HOODIES"],
    "price": 22.27,
    "original": 67.47,
    "discount": "-67%",
    "img": "clothing/zara_lbrH.jpg"
  },
  {
   "name": "Hoodie Dark Brown",
    "category": ["MEN","HOODIES"],
    "price": 22.27,
    "original": 67.47,
    "discount": "-67%",
    "img": "clothing/zara_brH.jpg"
  },
  {
    "name": "Hoodie Black",
    "category": ["MEN","HOODIES"],
    "price": 22.27,
    "original": 67.47,
    "discount": "-67%",
    "img": "clothing/zara_blH.jpg"
  },
 {
    "name": "Tennis Bundle",
    "category": ["MEN","GEAR","WOMEN"],
    "price": 18.56,
    "original": 53.02,
    "discount": "-70%",
    "img": "clothing/duo_racket.png"
  },
  {
    "name": "Women's Hockey Skates",
    "category": ["WOMEN","GEAR"],
    "price": 18.56,
    "original": 53.02,
    "discount": "-65%",
    "img": "clothing/hockey_women.png"
  },
  {
    "name": "Men's Hockey Skates",
    "category": ["MEN","GEAR"],
    "price": 18.56,
    "original": 53.02,
    "discount": "-65%",
    "img": "clothing/men_hockey.png"
  },
  {
    "name": "Men's Hockey Skates Brown",
    "category": ["MEN","GEAR"],
    "price": 18.56,
    "original": 53.02,
    "discount": "-65%",
    "img": "clothing/men_hockeybr.png"
  },
  {
    "name": "Equipment Bundle",
    "category":["WOMEN","GEAR"],
    "price": 60.00,
    "original": 200.00,
    "discount": "-70%",
    "img": "clothing/eqp_bundle.png"
  },
  
  
  
];

const cart = {};
let totalItems = 0;

function updateCartCount() {
  document.getElementById("cart-count").textContent = totalItems;
}

function renderProducts(filteredList = productList) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = ""; // Clear grid

  filteredList.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <p class="product-title">${item.name}</p>
      <p class="price">
        <span class="original-price">$${item.original}</span>
        <span class="discount">${item.discount}</span>
        <span class="final-price">$${item.price}</span>
      </p>
      <button class="add-to-cart" onclick="addToCart(${index})">Add to Cart</button>
      <div class="quantity-controls" id="qty-controls-${index}" style="display:none;">
        <button onclick="changeQty(${index}, -1)">−</button>
        <span id="qty-${index}">1</span>
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function addToCart(index) {
  if (!cart[index]) {
    cart[index] = 1;
    document.getElementById(`qty-controls-${index}`).style.display = "flex";
  } else {
    cart[index]++;
    document.getElementById(`qty-${index}`).textContent = cart[index];
  }
  totalItems++;
  updateCartCount();
  updateCartPreview();
}

function changeQty(index, delta) {
  if (cart[index]) {
    cart[index] += delta;
    if (cart[index] <= 0) {
      totalItems -= 1;
      delete cart[index];
      document.getElementById(`qty-controls-${index}`).style.display = "none";
    } else {
      totalItems += delta;
      document.getElementById(`qty-${index}`).textContent = cart[index];
    }
    updateCartCount();
    updateCartPreview();
  }
}

function updateCartPreview() {
  const container = document.getElementById('cart-items');
  const totalDisplay = document.getElementById('cart-total');
  container.innerHTML = '';
  let total = 0;

  Object.keys(cart).forEach(index => {
    const item = productList[index];
    const qty = cart[index];
    const subtotal = qty * item.price;
    total += subtotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `${item.name} x ${qty} = $${subtotal.toFixed(2)}`;
    container.appendChild(div);
  });

  totalDisplay.textContent = total.toFixed(2);
}

// Search functionality
document.getElementById("search-bar").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = productList.filter(item => item.name.toLowerCase().includes(query));
  renderProducts(filtered);
});

// Category filter
document.querySelectorAll(".category-nav a").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const label = this.textContent.trim().toUpperCase();

    if (label === "VIEW ALL") {
      return renderProducts(productList);
    }

    if (label === "FROM 70% OFF") {
      return renderProducts(productList.filter(item => item.discount === "-70%"));
    }

    // Otherwise treat label as a category name
    renderProducts(
      productList.filter(item => {
        const cats = Array.isArray(item.category) ? item.category : [item.category];
        return cats.some(c => String(c).toUpperCase() === label);
      })
    );
  });
});


// Initial render
renderProducts();
