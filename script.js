const productList = [
    { name: "Basic Sweatpants", price: 14.97, original: 49.99, discount: "-70%", img: "https://via.placeholder.com/300x400" },
    { name: "Baggy Fit Jeans", price: 20.97, original: 69.99, discount: "-70%", img: "https://via.placeholder.com/300x400" },
    { name: "Baggy Fit Jeans", price: 20.97, original: 69.99, discount: "-70%", img: "https://via.placeholder.com/300x400" },
    { name: "Baggy Fit Jeans", price: 20.97, original: 69.99, discount: "-70%", img: "https://via.placeholder.com/300x400" },
    { name: "Baggy Fit Jeans", price: 20.97, original: 69.99, discount: "-70%", img: "https://via.placeholder.com/300x400" },
    { name: "Baggy Fit Jeans", price: 20.97, original: 69.99, discount: "-70%", img: "https://via.placeholder.com/300x400" },

    // Repeat or generate more (up to 16)
  ];
  
  const cart = {};
  let totalItems = 0;
  
  function updateCartCount() {
    document.getElementById("cart-count").textContent = totalItems;
  }
  
  function renderProducts() {
    const grid = document.getElementById("product-grid");
    productList.forEach((item, index) => {
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
  
  renderProducts();

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
      div.innerHTML = `
        ${item.name} x ${qty} = $${subtotal.toFixed(2)}
      `;
      container.appendChild(div);
    });
  
    totalDisplay.textContent = total.toFixed(2);
  }
