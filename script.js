
// ===================== GLOBAL STORAGE =====================
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// ===================== NAVBAR DROPDOWN =====================
const navLeft = document.querySelector('.nav-left');
if (navLeft) {
  const dropdown = document.createElement('div');
  dropdown.className = 'dropdown';
  dropdown.innerHTML = `
  <!-- Add in your navbar dropdown -->
<a href="#" id="openReviewBox">Review</a>

<!-- Review Popup Box -->
<div id="reviewPopup" class="review-popup">
  <div class="review-content">
    <h3>Leave a Review</h3>
    <label>Name:</label>
    <input type="text" id="reviewName" placeholder="Your name">
    
    <label>Rating:</label>
    <select id="reviewStar">
      <option value="5">5 ⭐</option>
      <option value="4">4 ⭐</option>
      <option value="3">3 ⭐</option>
      <option value="2">2 ⭐</option>
      <option value="1">1 ⭐</option>
    </select>
    
    <label>Review:</label>
    <textarea id="reviewText" placeholder="Your review"></textarea>
    
    <button id="submitReview">Submit Review</button>
    <button id="goToReviewPage">→ View Reviews</button>
    <button id="closeReviewBox">✖</button>
  </div>
</div>
    <a href="about.html">About</a>
    <a href="review.html">Reviews</a>
    <a href="payment.html">Payment</a>
  `;
  navLeft.appendChild(dropdown);

  navLeft.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
}

// ===================== CART LOGIC =====================
let cartVisible = true;
function toggleCart() {
  const content = document.querySelector(".cart-content");
  if (!content) return;

  if (cartVisible) {
    content.style.maxHeight = "0";
    content.style.padding = "0 10px";
    cartVisible = false;
  } else {
    content.style.maxHeight = "350px";
    content.style.padding = "10px";
    cartVisible = true;
  }
}

let cart = [];

function addToCart(select) {
  let value = select.value;
  if (!value) return;

  let [name, price] = value.split("|");
  price = parseInt(price.trim());
  name = name.trim();

  let found = cart.find(item => item.name === name);
  if (found) found.qty++;
  else cart.push({ name, price, qty: 1 });

  select.selectedIndex = 0;
  displayCart();
}

function displayCart() {
  let cartDiv = document.getElementById("cartItems");
  if (!cartDiv) return;

  cartDiv.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    cartDiv.innerHTML += `
      <div class="cart-item">
        <span>${item.name} - Rs ${item.price}</span>
        <div>
          <button onclick="decrease(${index})">-</button>
          ${item.qty}
          <button onclick="increase(${index})">+</button>
          <button onclick="removeItem(${index})">❌</button>
        </div>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
}

function increase(index) { cart[index].qty++; displayCart(); }
function decrease(index) {
  if (cart[index].qty > 1) cart[index].qty--;
  else cart.splice(index, 1);
  displayCart();
}
function removeItem(index) { cart.splice(index, 1); displayCart(); }

// ===================== PLACE ORDER =====================
function placeOrder() {
  if (cart.length === 0) {
    alert("🛒 Your cart is empty!");
    return;
  }

  let tableNo = prompt("Enter Table Number:");
  if (!tableNo) return;

  let customerName = prompt("Enter Customer Name:");
  if (!customerName) return;

  let mobile = prompt("Enter Mobile Number:");
  if (!mobile) return;

  const orderId = Date.now();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const newOrder = {
    orderId: orderId,
    table: tableNo,
    name: customerName,
    mobile: mobile,
    items: [...cart],
    total: total,
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),
    status: "pending",        // kitchen status
    paymentStatus: "unpaid",  // payment status
    completed: false
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  cart = [];
  displayCart();
  alert("✅ Order sent to kitchen!");
}

// ===================== KITCHEN SYSTEM =====================
function loadKitchen() {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let pendingDiv = document.getElementById("pendingOrders");
  let doneDiv = document.getElementById("doneOrders");

  if (!pendingDiv || !doneDiv) return;

  pendingDiv.innerHTML = "";
  doneDiv.innerHTML = "";

  orders.forEach((order) => {
    let box = document.createElement("div");
    box.className = "order-box";

    box.innerHTML = `
      <div class="order-header">
        <b>Table ${order.table}</b>
        <span>#${order.orderId}</span>
      </div>

      <p><b>Name:</b> ${order.name}</p>
      <p><b>Mobile:</b> ${order.mobile}</p>
      <p><b>Time:</b> ${order.time}</p>
      <p><b>Items:</b> ${order.items.map(i => `${i.name} x ${i.qty}`).join(", ")}</p>
      <p><b>Total:</b> Rs ${order.total}</p>

      <p class="payment ${order.paymentStatus === "paid" ? 'paid' : 'unpaid'}">
        ${order.paymentStatus === "paid" ? "🟢 Payment Received" : "🔴 Payment Pending"}
      </p>

      <button onclick="markPaid(${order.orderId})">💳 Mark Paid</button>
      <button onclick="markDone(${order.orderId})">✅ Order Done</button>
    `;

    if (order.completed) doneDiv.appendChild(box);
    else pendingDiv.appendChild(box);
  });
}

// ===================== MARK PAID / DONE =====================
function markPaid(orderId) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders = orders.map(order => {
    if (order.orderId === orderId) {
      order.paymentStatus = "paid";
      if (order.status === "done") order.completed = true;
    }
    return order;
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  loadKitchen();
}

function markDone(orderId) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders = orders.map(order => {
    if (order.orderId === orderId) {
      order.status = "done";
      if (order.paymentStatus === "paid") order.completed = true;
    }
    return order;
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  loadKitchen();
}

// ===================== SEARCH SYSTEM =====================
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = [];

  document.querySelectorAll(".card").forEach(card => {
    card.querySelectorAll("select option").forEach(opt => {
      if (opt.value && opt.value !== "") {
        let [name] = opt.value.split("|");
        menuItems.push({ name: name.trim(), card });
      }
    });
  });

  const searchInput = document.getElementById("searchInput");
  const suggestionsDiv = document.getElementById("suggestions");
  if (!searchInput || !suggestionsDiv) return;

  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    suggestionsDiv.innerHTML = "";
    if (!value) { suggestionsDiv.style.display = "none"; return; }

    const matches = menuItems.filter(item => item.name.toLowerCase().includes(value));
    matches.forEach(item => {
      const div = document.createElement("div");
      div.innerText = item.name;
      div.onclick = () => {
        searchInput.value = item.name;
        suggestionsDiv.style.display = "none";
        highlightCard(item.card);
      };
      suggestionsDiv.appendChild(div);
    });

    suggestionsDiv.style.display = matches.length ? "block" : "none";
  });

  window.searchItem = function () {
    const value = searchInput.value.toLowerCase();
    const item = menuItems.find(item => item.name.toLowerCase() === value);
    if (item) highlightCard(item.card);
    else alert("Item not found!");
  };

  window.highlightCard = function (card) {
    document.querySelectorAll(".card").forEach(c => c.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)");
    card.style.boxShadow = "0 0 10px 3px orange";
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  };
});
//=====================
// REVIEW POPUP
const reviewPopup = document.getElementById("reviewPopup");
document.getElementById("openReviewBox").addEventListener("click", ()=>{
  reviewPopup.style.display = "flex";
});

document.getElementById("closeReviewBox").addEventListener("click", ()=>{
  reviewPopup.style.display = "none";
});

// Submit Review
document.getElementById("submitReview").addEventListener("click", ()=>{
  const name = document.getElementById("reviewName").value.trim();
  const star = parseInt(document.getElementById("reviewStar").value);
  const text = document.getElementById("reviewText").value.trim();
  const date = new Date().toLocaleDateString();

  if(!name || !text){
    alert("Please enter your name and review");
    return;
  }

  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviews.push({name, star, text, date});
  localStorage.setItem("reviews", JSON.stringify(reviews));

  alert("✅ Review submitted!");
  reviewPopup.style.display = "none";
  document.getElementById("reviewName").value="";
  document.getElementById("reviewText").value="";
});

// Go to Review Page
document.getElementById("goToReviewPage").addEventListener("click", ()=>{
  window.location.href = "review.html";
});
