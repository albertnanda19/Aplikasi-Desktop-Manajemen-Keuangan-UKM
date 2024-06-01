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
      const page = event.target.getAttribute("data-page");
      navigate(page);
    });
  });
};

const navigate = async (page) => {
  try {
    const response = await fetch(`pages/${page}`);
    const pageContent = await response.text();
    document.getElementById("content").innerHTML = pageContent;
  } catch (error) {
    console.error("Error loading page:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  navigate("dashboard.html"); // Load the dashboard content initially
});
