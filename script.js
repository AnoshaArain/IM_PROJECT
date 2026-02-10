// // ======= CART FUNCTIONALITY =======
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(button) {
    const card = button.parentElement;
    const select = card.querySelector(".item-select");
    const [name, price] = select.value.split("|");

    let item = cart.find(i => i.name === name);

    if(item) {
        item.qty++;
    } else {
        cart.push({ name, price: parseInt(price), qty: 1 });
    }

    saveCart();
    updateCart();
}

function updateCart() {
    const table = document.getElementById("cart-table");
    table.innerHTML = `
        <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Remove</th>
        </tr>
    `;

    let total = 0;

    cart.forEach((item, index) => {
        let row = table.insertRow();
        row.insertCell(0).innerText = item.name;
        row.insertCell(1).innerText = item.price;
        row.insertCell(2).innerHTML =
            `<button onclick="changeQty(${index}, -1)">-</button>
             ${item.qty}
             <button onclick="changeQty(${index}, 1)">+</button>`;
        row.insertCell(3).innerHTML =
            `<button onclick="removeItem(${index})">X</button>`;

        total += item.price * item.qty;
    });

    document.getElementById("total").innerText = total;
}

function changeQty(index, value) {
    cart[index].qty += value;
    if(cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

function checkout() {
    const payment = document.getElementById("payment").value;
    const total = document.getElementById("total").innerText;

    if(cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    if(payment === "") {
        alert("Please select payment method!");
        return;
    }

    alert(
        "Order Successful!\n" +
        "Payment: " + payment + "\n" +
        "Total: PKR " + total
    );

    cart = [];
    saveCart();
    updateCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ======= REVIEW FUNCTIONALITY =======
let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

function submitReview() {
    const name = document.getElementById('review-name').value.trim();
    const rating = document.getElementById('review-rating').value;
    const reviewText = document.getElementById('review').value.trim();

    if(name === "" || reviewText === "") {
        alert("Please provide your name and review!");
        return;
    }

    // Add review to array
    reviews.push({ name, rating, reviewText });
    saveReviews();
    displayReviews();

    // Clear inputs
    document.getElementById('review-name').value = "";
    document.getElementById('review').value = "";
    document.getElementById('review-rating').selectedIndex = 0;
}

function displayReviews() {
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Rating</th>
            <th>Comment</th>
        </tr>
    `;

    reviews.forEach(r => {
        let row = reviewsList.insertRow();
        row.insertCell(0).innerText = r.name;
        row.insertCell(1).innerText = r.rating;
        row.insertCell(2).innerText = r.reviewText;
    });
}

function saveReviews() {
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

// ======= Initialize on page load =======
document.addEventListener("DOMContentLoaded", () => {
    updateCart();
    displayReviews();
});




function checkout() {
    const tableNo = document.getElementById("table-number").value;

    if(tableNo === "") {
        alert("Please enter table number!");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.push({
        table: tableNo,
        items: cart,
        time: new Date().toLocaleTimeString()
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    saveCart();
    updateCart();

    alert("Order sent to kitchen!");
}


// kitchen


function loadKitchenOrders() {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    const container = document.getElementById("kitchen-orders");

    if (!container) return; // safety check

    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = "<p>No orders yet.</p>";
        return;
    }

    orders.forEach((order, index) => {
        let div = document.createElement("div");
        div.className = "kitchen-card";

        div.innerHTML = `
            <h3>Table ${order.table}</h3>
            <p>Time: ${order.time}</p>
            <ul>
                ${order.items.map(i => `<li>${i.name} × ${i.qty}</li>`).join("")}
            </ul>
        `;

        container.appendChild(div);
    });
}

// Auto load when kitchen page opens
document.addEventListener("DOMContentLoaded", loadKitchenOrders);




//nav

function openMenu() {
    document.getElementById('sideMenu').classList.toggle('hidden');
}

function showSection(section) {
    const sections = ['menu', 'about', 'contact', 'reviews', 'payment'];
    sections.forEach(sec => {
        const el = document.getElementById(sec + 'Section');
        if(el) el.classList.add('hidden');
    });

    const selected = document.getElementById(section + 'Section');
    if(selected) selected.classList.remove('hidden');

    document.getElementById('sideMenu').classList.add('hidden');
}
