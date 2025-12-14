export default async function handler(req, res) {
  const sheetUrl = process.env.SHEET_URL;

  try {
    const response = await fetch(sheetUrl);
    const csv = await response.text();
    const rows = csv.split("\n").slice(1); // skip header

    const produk = rows.map(row => {
      const [brand, item, flavor, price, stok, image, caption] = row.split(",");
      return { brand, item, flavor, price, stok, image, caption };
    });

    res.status(200).json({ produk });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
