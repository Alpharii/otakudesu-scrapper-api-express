import express from "express";
import { api } from "./app";

const app = express();

app.get("/", (_req, res) => {
  res.send(
    "Rutenya ada di /api\n\nDokumentasi: https://github.com/Alpharii/otakudesu-scrapper-api"
  );
});

app.use(api);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
