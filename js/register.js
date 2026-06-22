const registerForm = document.querySelector("#registerForm");


const firstNameInput = document.querySelector("#firstNameInput");
const lastNameInput = document.querySelector("#lastNameInput");
const ageInput = document.querySelector("#ageInput");
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const confirmInput = document.querySelector("#confirmInput");
const addressInput = document.querySelector("#addressInput");
const phoneInput = document.querySelector("#phoneInput");
const zipcodeInput = document.querySelector("#zipcodeInput");
const avatarInput = document.querySelector("#avatarInput");
const genderInput = document.querySelector("#genderInput");


const successMsg = document.querySelector("#successMsg");


console.log({
  firstName: firstNameInput.value.trim(),
  lastName: lastNameInput.value.trim(),
  age: Number(ageInput.value),
  email: emailInput.value.trim(),
  password: passwordInput.value,
  address: addressInput.value.trim(),
  phone: phoneInput.value.trim(),
  zipcode: zipcodeInput.value.trim(),
  avatar: avatarInput.value.trim(),
  gender: genderInput.value,
});





registerForm.addEventListener("submit", async (e) => {
e.preventDefault();

if (passwordInput.value !== confirmInput.value) {
alert("პაროლები არ ემთხვევა!");
return;
}

if (!phoneInput.value.startsWith("+995")) {
alert("ტელეფონი უნდა იყოს +995 ფორმატში");
return;
}

try {
// Email Verification
const verifyResponse = await fetch(
"https://api.everrest.educata.dev/auth/verify_email",
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
email: emailInput.value.trim(),
}),
}
);

// ემაილის ვერიფიკაცია //

const verifyData = await verifyResponse.json();
console.log("VERIFY:", verifyData);

if (!verifyResponse.ok) {
  alert("ელ-ფოსტის ვერიფიკაცია ვერ შესრულდა");
  return;
}

alert("ვერიფიკაციის კოდი გაიგზავნა ელ-ფოსტაზე!");

// Registration
const response = await fetch(
  "https://api.everrest.educata.dev/auth/sign_up",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      age: Number(ageInput.value),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      address: addressInput.value.trim(),
      phone: phoneInput.value.trim(),
      zipcode: zipcodeInput.value.trim(),
      avatar: avatarInput.value.trim(),
      gender: genderInput.value,
    }),
  }
);

const data = await response.json();

console.log("REGISTER:", data);
console.log("STATUS:", response.status);

if (!response.ok) {
  alert(JSON.stringify(data, null, 2));
  return;
}

successMsg.style.display = "block";

setTimeout(() => {
  window.location.href = "index.html";
}, 1500);


} catch (error) {
console.error(error);
alert("სერვერთან კავშირის შეცდომა");
}
});
