
// დოკუმენტები დაწყება //


const cardsContainer = document.querySelector(".cards");
const menuList = document.querySelector(".menu-list");

const cartContainer = document.querySelector(".cart-container");
const totalPriceEl = document.querySelector("#totalPrice");

const spicinessSelect = document.querySelector("#spiciness");
const nutsCheckbox = document.querySelector("#nuts");
const vegetarianCheckbox = document.querySelector("#vegetarian");

const applyBtn = document.querySelector("#applyBtn");
const resetBtn = document.querySelector("#resetBtn");


// დოკუმენტები დასასრული //





// fetch დაიწყო //


async function Fetch(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    console.error(err);
    return { ok: false, data: null };
  }
}


// fetch დასრულდა //



// welcome start //

function checkRegistrationStatus() {
  const welcomeBox = document.querySelector("#welcomeBox");
  const welcomeText = document.querySelector("#welcomeText");

  const isRegistered = sessionStorage.getItem("isRegistered");
  const userName = sessionStorage.getItem("userName");

  if (isRegistered === "true") {
    welcomeBox.style.display = "flex";
    welcomeText.textContent = userName;
  }
}

// welcome end //



// state start //


let selectedCategoryId = null;
let selectedSpiciness = null;
let noNuts = false;
let vegetarianOnly = false;
let isRegistered = false;


// state end //







// პროდუქტები! დაიწყო //


async function getProducts() {
  if (!cardsContainer) return;

  cardsContainer.innerHTML = "Loading...";

  const result = await Fetch(
    "https://restaurant.stepprojects.ge/api/Products/GetAll"
  );

  if (!result.ok) return;

  renderProducts(result.data);
}



const spicyText = document.querySelector("#spicyText");


resetBtn?.addEventListener("click", () => {
  selectedSpiciness = null;
  noNuts = false;
  vegetarianOnly = false;
  selectedCategoryId = null;

  if (spicinessSelect) spicinessSelect.value = "0";
  if (nutsCheckbox) nutsCheckbox.checked = false;
  if (vegetarianCheckbox) vegetarianCheckbox.checked = false;

  if (spicyText) {
    spicyText.textContent = "Spiciness: Not Chosen";
  }

  getProducts();
});



// სიცხარე დაიწყო აქ! //


spicinessSelect?.addEventListener("input", () => {
  selectedSpiciness =
    spicinessSelect.value !== "not chosen"
      ? spicinessSelect.value
      : null;

  if (spicyText) {
    spicyText.textContent =
      selectedSpiciness === null
        ? "Spiciness: 0"
        : `Spiciness: ${selectedSpiciness}`;
  }
});


// სიცხარე დსრულდა აქ !! //




// პროდუქტების გაფილტვრა დაიწყო! //


async function getFilteredProducts() {
  if (!cardsContainer) return;

  const url = new URL(
    "https://restaurant.stepprojects.ge/api/Products/GetFiltered"
  );

  if (selectedCategoryId) {
    url.searchParams.append("categoryId", selectedCategoryId);
  }

  if (selectedSpiciness !== null && selectedSpiciness !== "0") {
  url.searchParams.append("spiciness", selectedSpiciness);
}

  if (noNuts) {
    url.searchParams.append("nuts", false);
  }

  if (vegetarianOnly) {
    url.searchParams.append("vegeterian", true);
  }

  const result = await Fetch(url);

  if (!result.ok) return;

  renderProducts(result.data);
}



// პროდუქტების გაფილტვრა დასრულდა !//


function renderProducts(products) {
  if (!cardsContainer) return;

  cardsContainer.innerHTML = "";

  products.forEach((p) => {
    cardsContainer.innerHTML += `
      <div class="card">
        <img src="${p.image}" />
        <h4>${p.name}</h4>
        <h3> spiciness : ${p.spiciness}</h3>
        <p>$${p.price}</p>
        <p>Nuts : ${p.nuts ? "✔️" : "✖️"}</p> 
        <p>Vegetarian : ${p.vegeterian ? "✔️" : "✖️"}</p>
        
        

        <button class="add-btn" data-id="${p.id}" data-price="${p.price}">
          Add to cart
        </button>
      </div>
    `;
  });

  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.id, btn.dataset.price);
    });
  });
}



// პროდუქტები! დასრულდა //





// !კალათის api დაიწყო აქ ! //





// კლათაში დამატება დაიწყო! ///////////


async function addToCart(id, price, currentQuantity = 0) {
   
const isRegistered = sessionStorage.getItem("isRegistered");

if (isRegistered !== "true") {
  alert("კალათაში დასამატებლად დარეგისტრირდი!");
  window.location.href = "registerpage.html";
  return;
}

  const cartRes = await fetch(
    "https://restaurant.stepprojects.ge/api/Baskets/GetAll"
  );

  const cart = await cartRes.json();

  const existingItem = cart.find(
    (item) => item.product.id == id
  );


  // თუ უკვე არსებობს პროდუქტში


  if (existingItem) {
    await fetch(
      "https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: existingItem.id,
          quantity: existingItem.quantity + 1,
          price: Number(price),
          productId: Number(id),
        }),
      }
    );
  } 
  
  // თუ არ არსებობს


  else {
    await fetch(
      "https://restaurant.stepprojects.ge/api/Baskets/AddToBasket",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          quantity: 1,
          price: Number(price),
          productId: Number(id),
        }),
      }
    );
  }

  getCart();
}



// კალათაში დამატება დასრულდა! ///////////












// კალათიდან ამოშლა!!! //


async function removeOne(id) {
  await fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${id}`, {
    method: "DELETE",
  });

  getCart();
}


// კალათიდან ამოშლა!! დასრულდა //






// CART! კალათა და მისი გამოყენება დაიწყო  ! //


async function getCart() {
  if (!cartContainer) return;

  const res = await fetch(
    "https://restaurant.stepprojects.ge/api/Baskets/GetAll"
  );

  const data = await res.json();

  renderCart(data || []);
}

function renderCart(items) {
  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  let total = 0;

  items.forEach((item) => {
    total += item.price * item.quantity;

    cartContainer.innerHTML += `
  <div class="cart-item">

    <img 
      src="${item.product?.image}" 
      alt="${item.product?.name}"
      class="cart-img"
    />

    <div>
      <h3>${item.product?.name || "Product"}</h3>
      <p>$${item.price}</p>

      <div class="qty-controls">
        <button class="minus-btn" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>

        <button
          class="plus-btn"
          data-id="${item.product.id}"
          data-price="${item.price}"
          data-quantity="${item.quantity}">
          +
        </button>
      </div>
    </div>

    <button class="remove-btn" data-id="${item.product.id}">
      Remove
    </button>

  </div>
`;

  });

  if (totalPriceEl) {
    totalPriceEl.textContent = total.toFixed(2);
  }
}


// კალათა და მისი საბოლლო ჯამის გამოთვლა დასრულდა!!! //














// ნიგვზიანი,სიცხარე,ვეგეტარიანული დაიწყო //



applyBtn?.addEventListener("click", () => {
  noNuts = nutsCheckbox.checked;
  vegetarianOnly = vegetarianCheckbox.checked;

  getFilteredProducts();
});


resetBtn?.addEventListener("click", () => {

  selectedSpiciness = null;
  noNuts = false;
  vegetarianOnly = false;
  selectedCategoryId = null;

  if (spicinessSelect) spicinessSelect.value = "0";
  if (nutsCheckbox) nutsCheckbox.checked = false;
  if (vegetarianCheckbox) vegetarianCheckbox.checked = false;

  if (spicyText) {
    spicyText.textContent = "Spiciness: Not Chosen";
  }

  getProducts();

});




// ვეგეტარიანული,ცხარე,ნიგვზიანი დასრულდა //









// კალათაში დამატება და გამოკლება (+ / -) //


cartContainer?.addEventListener("click", (e) => {
  const minus = e.target.closest(".minus-btn");
  const plus = e.target.closest(".plus-btn");
  const remove = e.target.closest(".remove-btn");

  if (plus) {
  addToCart(
    plus.dataset.id,
    plus.dataset.price,
    Number(plus.dataset.quantity)
  );
}

  if (minus) {
    removeOne(minus.dataset.id);
  }

  if (remove) {
    removeOne(remove.dataset.id);
  }
});

// კალათაში დამატება და გამოკლება დასრულდა აქ! //



// CATEGORIES დაიწყო! //


async function getCategories() {
  if (!menuList) return;

  const result = await Fetch(
    "https://restaurant.stepprojects.ge/api/Categories/GetAll"
  );

  if (!result.ok) return;

  menuList.innerHTML = `<li data-id="all">All</li>`;

  result.data.forEach((c) => {
    menuList.innerHTML += `<li data-id="${c.id}">${c.name}</li>`;
  });

  document.querySelectorAll(".menu-list li").forEach((li) => {
    li.addEventListener("click", () => {
      selectedCategoryId = li.dataset.id === "all" ? null : li.dataset.id;

      selectedCategoryId ? getFilteredProducts() : getProducts();
    });
  });
}



// CATEGORIES დასრულდა! //


// INIT SAFER START ! //

if (cardsContainer) getProducts();
if (menuList) getCategories();
if (cartContainer) getCart();

checkRegistrationStatus();

// INIT SAFER END ! //

