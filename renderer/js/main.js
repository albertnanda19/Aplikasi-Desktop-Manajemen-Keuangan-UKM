const { ipcRenderer } = require("electron");

const loadNavbar = async () => {
  try {
    const response = await fetch("navbar.html");
    const navbarHtml = await response.text();
    document.getElementById("navbar").innerHTML = navbarHtml;
    setupNavbarEvents(); // Set up the events after loading the navbar
  } catch (error) {
    console.error("Error loading navbar:", error);
  }
};

const setupNavbarEvents = () => {
  document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const page = event.target.getAttribute("onclick").match(/'([^']+)'/)[1];
      navigate(page);
    });
  });
};

const navigate = (page) => {
  ipcRenderer.send("navigate", page);
};

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
});
