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
    } else if (page === "laporan.html") {
      setupReportPage();
    } else if (page === "pengeluaran.html") {
      await loadCategories();
      document
        .getElementById("simpanPengeluaranButton")
        .addEventListener("click", async () => {
          await addExpense();
        });
    } else if (page === "pemasukan.html") {
      await loadCategories();
      document
        .getElementById("simpanPemasukanButton")
        .addEventListener("click", async () => {
          await addIncome();
        });
    }
  } catch (error) {
    console.error("Error loading page:", error);
  }
};

const loadDashboardData = async () => {
  try {
    const response = await fetch("http://150.136.51.219:8000/dashboard");
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

const loadCategories = async () => {
  try {
    const response = await fetch("http://150.136.51.219:8000/categories");
    const result = await response.json();

    const select = document.getElementById("kategori");

    result.data.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.category;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
};

const addExpense = async () => {
  const amount = document.getElementById("jumlahUang").value;
  const date = document.getElementById("tanggal").value;
  let time = document.getElementById("waktu").value;
  const category = document.getElementById("kategori").value;
  const note = document.getElementById("catatanTambahan").value;

  if (!amount || !date || !time || !category) {
    alert("Semua bidang harus diisi!");
    return;
  }

  // Add ":00" to the time if it's in "HH:mm" format
  if (time.length === 5) {
    time += ":00";
  }

  const expenseData = {
    amount: parseInt(amount),
    date: date,
    time: time,
    category: category,
    note: note,
  };

  try {
    const response = await fetch("http://150.136.51.219:8000/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });

    if (response.ok) {
      alert("Pengeluaran berhasil disimpan!");
    } else {
      const errorData = await response.json();
      alert(`Gagal menyimpan pengeluaran. Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error adding expense:", error);
    alert("Terjadi kesalahan saat menyimpan pengeluaran. Silakan coba lagi.");
  }
};

const addIncome = async () => {
  const amount = document.getElementById("jumlahUang").value;
  const date = document.getElementById("tanggal").value;
  let time = document.getElementById("waktu").value;
  const category = document.getElementById("kategori").value;
  const note = document.getElementById("catatanTambahan").value;

  if (!amount || !date || !time || !category) {
    alert("Semua bidang harus diisi!");
    return;
  }

  if (time.length === 5) {
    time += ":00";
  }

  const expenseData = {
    amount: parseInt(amount),
    date: date,
    time: time,
    category: category,
    note: note,
  };

  try {
    const response = await fetch("http://150.136.51.219:8000/income", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });

    if (response.ok) {
      alert("Pemasukan berhasil disimpan!");
    } else {
      const errorData = await response.json();
      alert(`Gagal menyimpan pengeluaran. Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error adding expense:", error);
    alert("Terjadi kesalahan saat menyimpan pengeluaran. Silakan coba lagi.");
  }
};

const setupReportPage = () => {
  const filterButton = document.getElementById("filter-button");
  if (filterButton) {
    filterButton.addEventListener("click", async () => {
      const date = document.getElementById("date").value;
      if (date) {
        await loadReportData(date);
        document.getElementById("selected-date").innerText = date;
      }
    });
  }

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("date").value = today;
  loadReportData(today);
  document.getElementById("selected-date").innerText = today;
};

const loadReportData = async (date) => {
  try {
    const response = await fetch(
      `http://150.136.51.219:8000/report?date=${date}`
    );
    const result = await response.json();
    const data = result.data;

    const tableBody = document.querySelector("#report-table tbody");
    tableBody.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.type}</td>
        <td>${formatRupiah(item.amount)}</td>
      `;
      tableBody.appendChild(row);

      if (item.type === "income") {
        totalIncome += item.amount;
      } else if (item.type === "expense") {
        totalExpense += item.amount;
      }
    });

    const totalProfit = totalIncome - totalExpense;

    document.getElementById("total-income").innerText =
      formatRupiah(totalIncome);
    document.getElementById("total-expense").innerText =
      formatRupiah(totalExpense);
    document.getElementById("total-profit").innerText =
      formatRupiah(totalProfit);
  } catch (error) {
    console.error("Error fetching report data:", error);
  }
};

const formatRupiah = (amount) => {
  return amount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
};

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  navigate("dashboard.html");
  setupReportPage();
});
