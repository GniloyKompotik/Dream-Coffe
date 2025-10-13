function updateDateTime() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  document.getElementById("dateTime").textContent = now.toLocaleString('en-US', options);
}
setInterval(updateDateTime, 1000);
updateDateTime();

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".needs-validation");

  form.addEventListener("submit", function (event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add("was-validated");
  });
});

const openPopup = document.getElementById("openPopup");
const closePopup = document.getElementById("closePopup");
const popupForm = document.getElementById("popupForm");

if (openPopup && closePopup && popupForm) {
  openPopup.addEventListener("click", () => {
    popupForm.style.display = "flex";
  });

  closePopup.addEventListener("click", () => {
    popupForm.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === popupForm) {
      popupForm.style.display = "none";
    }
  });
}

const colors = ["#f8e1d4", "#d4f8e1", "#e1d4f8", "#f8f1d4", "#d4e9f8"];
document.getElementById("changeColorBtn").addEventListener("click", function () {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.backgroundColor = randomColor;
});
