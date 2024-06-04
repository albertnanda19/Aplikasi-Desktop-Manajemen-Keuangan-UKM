const Chart = require("chart.js/auto");
const moment = require("moment");
require("chartjs-adapter-moment");

const loadNavbar = async () => {
  try {
    const response = await fetch("navbar.html");
    const navbarHtml = await response.text();
    document.getElementById("navbar").innerHTML = navbarHtml;
    setupNavbarEvents();
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

    if (page === "dashboard.html") {
      loadDashboardData();
    }
  } catch (error) {
    console.error("Error loading page:", error);
  }
};

const loadDashboardData = async () => {
  try {
    const response = await fetch("http://localhost:8000/dashboard");
    const result = await response.json();
    const data = result.data;

    const formatRupiah = (amount) => {
      return amount.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      });
    };

    document.getElementById("profit-amount").innerText = formatRupiah(
      data.profit.amount
    );
    document.getElementById("profit-from-date").innerText =
      data.profit.from_date;
    document.getElementById("profit-to-date").innerText = data.profit.to_date;

    document.getElementById("income-amount").innerText = formatRupiah(
      data.income.amount
    );
    document.getElementById("income-from-date").innerText =
      data.income.from_date;
    document.getElementById("income-to-date").innerText = data.income.to_date;

    document.getElementById("expense-amount").innerText = formatRupiah(
      data.expense.amount
    );
    document.getElementById("expense-from-date").innerText =
      data.expense.from_date;
    document.getElementById("expense-to-date").innerText = data.expense.to_date;

    loadChart("profit-chart", "Keuntungan", data.profit.detail);
    loadChart("income-chart", "Pemasukan", data.income.detail);
    loadChart("expense-chart", "Pengeluaran", data.expense.detail);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

const loadChart = (canvasId, label, data) => {
  const ctx = document.getElementById(canvasId).getContext("2d");
  const labels = data.map((item) => item.date);
  const amounts = data.map((item) => item.amount);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: amounts,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            parser: "YYYY-MM-DD",
            unit: "day",
            tooltipFormat: "ll",
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  navigate("dashboard.html");
});
