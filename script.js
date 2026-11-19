// API externa para mostrar productos de otros comercios.
const API_URL = "https://dummyjson.com/products?limit=8";

// Catálogo propio de Qué Torta.
const localProducts = [
  {
    id: 101,
    title: "Torta Oreo",
    description: "Torta Oreo de 18 cm, cremosa y deliciosa.",
    price: 18500,
    thumbnail: "Imagenes del sitio/Torta Oreo.jpg"
  },
  {
    id: 102,
    title: "Chocotorta",
    description: "La clásica combinación de chocolinas y crema.",
    price: 17000,
    thumbnail: "Imagenes del sitio/chocotorta.jpg"
  },
  {
    id: 103,
    title: "Tiramisú",
    description: "Postre italiano con café y crema.",
    price: 19000,
    thumbnail: "Imagenes del sitio/tiramisu.jpg"
  },
  {
    id: 104,
    title: "Cheesecake de frutilla",
    description: "Tarta suave con cubierta de frutillas.",
    price: 20000,
    thumbnail: "Imagenes del sitio/CHEKESE FRUTILLA.jpg"
  }
];

const productsContainer = document.getElementById("products-container");
const apiProductsContainer = document.getElementById("api-products-container");
const apiStatus = document.getElementById("api-status");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartUnits = document.getElementById("cart-units");
const cartTotal = document.getElementById("cart-total");
const checkoutMessage = document.getElementById("checkout-message");

let products = localProducts;
let cart = loadCart();

function formatPrice(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
}

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("queTortaCart"));
    return Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    console.error("No se pudo leer el carrito:", error);
    return [];
  }
}

function saveCart() {
  localStorage.setItem("queTortaCart", JSON.stringify(cart));
}

// Mostrar las tortas propias en la sección principal.
function renderProducts() {
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.src = product.thumbnail;
    image.alt = product.title;
    image.loading = "lazy";
    image.onerror = () => {
      image.src = "https://placehold.co/600x400/f8dce5/6b3549?text=Que+Torta";
    };

    const info = document.createElement("div");
    info.className = "product-info";

    const title = document.createElement("h3");
    title.textContent = product.title;

    const description = document.createElement("p");
    description.textContent = product.description;

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.className = "btn-main";
    button.type = "button";
    button.textContent = "Agregar al carrito";
    button.addEventListener("click", () => addToCart(product.id));

    info.append(title, description, price, button);
    card.append(image, info);
    productsContainer.appendChild(card);
  });
}

// Mostrar los productos recibidos desde la API en la sección de otros comercios.
function renderApiProducts(apiProducts) {
  apiProductsContainer.innerHTML = "";

  apiProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.src = product.thumbnail;
    image.alt = product.title;
    image.loading = "lazy";
    image.onerror = () => {
      image.src = "https://placehold.co/600x400/f8dce5/6b3549?text=Producto";
    };

    const info = document.createElement("div");
    info.className = "product-info";

    const title = document.createElement("h3");
    title.textContent = product.title;

    const description = document.createElement("p");
    description.textContent = product.description;

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.className = "btn-main";
    button.type = "button";
    button.textContent = "Agregar al carrito";
    button.addEventListener("click", () => addToCart(product.id));

    info.append(title, description, price, button);
    card.append(image, info);
    apiProductsContainer.appendChild(card);
  });
}

// Fetch consulta la API REST y recibe los productos en formato JSON.
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Error HTTP: " + response.status);
    }

    const data = await response.json();

    if (!Array.isArray(data.products)) {
      throw new Error("La respuesta de la API no tiene el formato esperado.");
    }

    // Se guardan también en el listado general para que el carrito los encuentre y puedan comorar productos de nuestros otros locales.
    const apiProducts = data.products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail
    }));

    products = [...localProducts, ...apiProducts];
    renderApiProducts(apiProducts);
    apiStatus.textContent = "Productos de otros comercios cargados correctamente desde la API REST.";
  } catch (error) {
    console.error("No se pudieron cargar los productos de la API:", error);
    apiStatus.textContent = "No se pudieron cargar los productos en este momento. Probá nuevamente más tarde.";
  }
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  checkoutMessage.textContent = product.title + " se agregó al carrito.";
}

function changeQuantity(productId, amount) {
  const item = cart.find((product) => product.id === productId);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.id !== productId);
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-cart";
    empty.textContent = "Todavía no agregaste productos.";
    cartItemsContainer.appendChild(empty);
  }

  let totalUnits = 0;
  let totalPrice = 0;

  cart.forEach((item) => {
    totalUnits += item.quantity;
    totalPrice += item.price * item.quantity;

    const row = document.createElement("article");
    row.className = "cart-row";

    const productInfo = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title;

    const unitPrice = document.createElement("p");
    unitPrice.textContent = formatPrice(item.price) + " por unidad";
    productInfo.append(title, unitPrice);

    const quantityControl = document.createElement("div");
    quantityControl.className = "quantity-control";

    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", "Disminuir cantidad de " + item.title);
    decrease.addEventListener("click", () => changeQuantity(item.id, -1));

    const quantity = document.createElement("strong");
    quantity.textContent = item.quantity;

    const increase = document.createElement("button");
    increase.type = "button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", "Aumentar cantidad de " + item.title);
    increase.addEventListener("click", () => changeQuantity(item.id, 1));

    quantityControl.append(decrease, quantity, increase);

    const subtotal = document.createElement("strong");
    subtotal.textContent = formatPrice(item.price * item.quantity);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-btn";
    remove.textContent = "Eliminar";
    remove.addEventListener("click", () => removeFromCart(item.id));

    row.append(productInfo, quantityControl, subtotal, remove);
    cartItemsContainer.appendChild(row);
  });

  cartCount.textContent = totalUnits;
  cartUnits.textContent = totalUnits;
  cartTotal.textContent = formatPrice(totalPrice);
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    checkoutMessage.textContent = "Tu carrito está vacío. Agregá algún producto antes de simular la compra.";
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  checkoutMessage.textContent = "¡Compra simulada correctamente! Total: " + formatPrice(total) + ". Esta demostración no realiza un cobro real.";
  cart = [];
  saveCart();
  renderCart();
});


const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", (event) => {
  const name = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("mensaje").value.trim();
  const formMessage = document.getElementById("form-message");

  if (!name || !email || !message) {
    event.preventDefault();
    formMessage.textContent = "Completá todos los campos antes de enviar.";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    event.preventDefault();
    formMessage.textContent = "Ingresá un correo electrónico válido.";
    return;
  }

  formMessage.textContent = "Enviando mensaje...";
});


renderProducts();
renderCart();
fetchProducts();
