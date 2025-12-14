function kirimPesanan() {
  fetch("/api/sendOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pesan: "Pesanan baru: Liquid A x1" })
  })
  .then(res => res.json())
  .then(data => {
    alert("Pesanan berhasil dikirim ke admin!");
    console.log(data);
  })
  .catch(err => {
    alert("Gagal kirim pesanan.");
    console.error(err);
  });
<<<<<<< HEAD
}
=======
}
>>>>>>> dffd565443f7dd6c018e91a96861f8e216e7c558
