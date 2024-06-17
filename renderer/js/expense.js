document.addEventListener("DOMContentLoaded", async () => {
  console.log("test");
  await loadCategories();

  document
    .getElementById("simpanButton")
    .addEventListener("click", async () => {
      await addExpense();
    });
});

const loadCategories = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/categories");
    const result = await response.json();
    console.log("test");
    console.log(result.data);

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
  const time = document.getElementById("waktu").value;
  const category = document.getElementById("kategori").value;
  const note = document.getElementById("catatanTambahan").value;

  if (!amount || !date || !time || !category) {
    alert("Semua bidang harus diisi!");
    return;
  }

  const expenseData = {
    amount: parseInt(amount),
    date: date,
    time: time,
    category: category,
    note: note,
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });

    if (response.ok) {
      alert("Pengeluaran berhasil disimpan!");
      // Optionally, you can clear the form or redirect the user
    } else {
      alert("Gagal menyimpan pengeluaran. Coba lagi.");
    }
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};
