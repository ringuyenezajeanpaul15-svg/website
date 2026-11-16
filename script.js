// Electrical Engineering Products & Services Catalog
const servicesAndProducts = [
  {
    id: 1,
    name: "Full House Electrical Installation",
    description: "Complete safe wiring, sockets, switches, and main breaker board installation.",
    price: "50,000 RWF"
  },
  {
    id: 2,
    name: "Electrical Maintenance & Fault Repair",
    description: "Inspection, short-circuit troubleshooting, and power restoration.",
    price: "20,000 RWF"
  },
  {
    id: 3,
    name: "Solar Panel & Inverter Installation",
    description: "Hybrid solar setup with battery backup installation and testing.",
    price: "150,000 RWF"
  },
  {
    id: 4,
    name: "Automatic Voltage Stabilizer (5kVA)",
    description: "Protects home and office appliances from power surges and low voltage.",
    price: "85,000 RWF"
  },
  {
    id: 5,
    name: "Smart Distribution Board & Breakers",
    description: "Heavy-duty circuit protection unit with surge arresters.",
    price: "35,000 RWF"
  },
  {
    id: 6,
    name: "Industrial Motor & Panel Maintenance",
    description: "Preventive servicing for commercial pumps, motors, and control panels.",
    price: "60,000 RWF"
  }
];

let currentUser = null;
let userOrders = [];

// Switch between sections
function showSection(sectionName) {
  document.getElementById("home-section").classList.add("hidden");
  document.getElementById("register-section").classList.add("hidden");
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("dashboard-section").classList.add("hidden");

  // Clear old messages
  document.getElementById("register-msg").textContent = "";
  document.getElementById("login-msg").textContent = "";

  if (sectionName === "dashboard" && !currentUser) {
    showSection("login");
    return;
  }

  document.getElementById(`${sectionName}-section`).classList.remove("hidden");
}

// Handle Account Creation
document.getElementById("register-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("reg-name").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const pin = document.getElementById("reg-pin").value.trim();
  const msg = document.getElementById("register-msg");

  // Validate 4-digit PIN
  if (!/^\d{4}$/.test(pin)) {
    msg.className = "message error";
    msg.textContent = "Please enter a valid 4-digit numeric PIN.";
    return;
  }

  // Save user in browser localStorage
  const users = JSON.parse(localStorage.getItem("ringuyeneza_users")) || [];
  users.push({ name, phone, pin });
  localStorage.setItem("ringuyeneza_users", JSON.stringify(users));

  msg.className = "message success";
  msg.textContent = "Account created successfully! Redirecting to login...";

  document.getElementById("register-form").reset();

  setTimeout(() => {
    showSection("login");
  }, 1200);
});

// Handle Login with Name and 4-Digit PIN
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const inputName = document.getElementById("login-name").value.trim();
  const inputPin = document.getElementById("login-pin").value.trim();
  const loginMsg = document.getElementById("login-msg");

  const users = JSON.parse(localStorage.getItem("ringuyeneza_users")) || [];

  // Find matching account (case-insensitive name + exact 4-digit PIN)
  const matchedUser = users.find(
    (u) => u.name.toLowerCase() === inputName.toLowerCase() && u.pin === inputPin
  );

  if (!matchedUser) {
    loginMsg.textContent = "Incorrect Name or 4-Digit PIN. Try again.";
    return;
  }

  // Login Success
  currentUser = matchedUser;
  userOrders = [];
  document.getElementById("login-form").reset();
  loadDashboard();
  showSection("dashboard");
});

// Load Dashboard Products & User Info
function loadDashboard() {
  document.getElementById("welcome-user").textContent = `Welcome to Ringuyeneza Company, ${currentUser.name}!`;
  document.getElementById("user-phone-display").textContent = `Registered Telephone: ${currentUser.phone}`;

  // Update Navbar
  document.getElementById("nav-register").classList.add("hidden");
  document.getElementById("nav-login").classList.add("hidden");
  document.getElementById("nav-dashboard").classList.remove("hidden");
  document.getElementById("nav-logout").classList.remove("hidden");

  // Render Electrical Engineering Products
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  servicesAndProducts.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
      <div>
        <div class="price">${item.price}</div>
        <button class="btn-buy" onclick="tapToBuy(${item.id})">Tap to Buy</button>
      </div>
    `;
    productList.appendChild(card);
  });

  renderOrders();
}

// Handle "Tap to Buy"
function tapToBuy(productId) {
  const product = servicesAndProducts.find((p) => p.id === productId);
  if (!product) return;

  userOrders.push(product);
  renderOrders();
  alert(`Order confirmed for "${product.name}" (${product.price})!\nRinguyeneza Company will contact you on ${currentUser.phone}.`);
}

// Render Selected Orders
function renderOrders() {
  const orderList = document.getElementById("order-list");
  orderList.innerHTML = "";

  if (userOrders.length === 0) {
    orderList.innerHTML = `<li class="empty-order">No items selected yet. Click "Tap to Buy" on any service or product above.</li>`;
    return;
  }

  userOrders.forEach((order, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>#${index + 1}</strong> ${order.name}</span>
      <span style="color: #16a34a; font-weight: bold;">${order.price}</span>
    `;
    orderList.appendChild(li);
  });
}

// Logout
function logout() {
  currentUser = null;
  document.getElementById("nav-register").classList.remove("hidden");
  document.getElementById("nav-login").classList.remove("hidden");
  document.getElementById("nav-dashboard").classList.add("hidden");
  document.getElementById("nav-logout").classList.add("hidden");
  showSection("home");
}