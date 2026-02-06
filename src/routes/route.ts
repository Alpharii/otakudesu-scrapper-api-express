import { Router } from "express";
import { home } from "../controller/home";
import { ongoing } from "../controller/ongoing";
import { complete } from "../controller/complete";
import { detailAnime } from "../controller/detail-anime";
import { detailEpisode } from "../controller/detail-episode";
import { search } from "../controller/search";

export const routes = Router();

routes.get("/", async (_req, res) => {
  const data = await home();
  res.json(data);
});

routes.get("/ongoing/:page", async (req, res) => {
  const { page } = req.params;
  const data = await ongoing(page);
  res.json(data);
});

routes.get("/complete/:page", async (req, res) => {
  const { page } = req.params;
  const data = await complete(page);
  res.json(data);
});

routes.get("/anime/:slug", async (req, res) => {
  const { slug } = req.params;
  const data = await detailAnime(slug);
  res.json(data);
});

routes.get("/episode/:slug", async (req, res) => {
  const { slug } = req.params;
  const data = await detailEpisode(slug);
  res.json(data);
});

routes.get("/anime", async (req, res) => {
  const q = req.query.q as string;
  const data = await search(q);
  res.json(data);
});
