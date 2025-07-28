import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";

const app = express();

/* ************************************************************************* */

// ... (le reste inchangé)

if (process.env.CLIENT_URL != null) {
  app.use(cors({ origin: [process.env.CLIENT_URL] }));
}

app.use(express.json());

const publicFolderPath = path.join(__dirname, "../../server/public");

if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

import router from "./router";
app.use(router);

import discoveredRouter from "./modules/discovered/discoveredRouter";
app.use("/api/discovered", discoveredRouter);

// ... (le reste inchangé)

// Serve server resources

// ** Ajout pour servir le dossier uploads en statique **
const uploadsPath = path.join(__dirname, "../../uploads");
if (fs.existsSync(uploadsPath)) {
  app.use("/uploads", express.static(uploadsPath));
}

// Serve client resources
const clientBuildPath = path.join(__dirname, "../../client/dist");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get("*", (_, res) => {
    res.sendFile("index.html", { root: clientBuildPath });
  });
}

/* ************************************************************************* */

import type { ErrorRequestHandler } from "express";

const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  console.error("on req:", req.method, req.path);
  next(err);
};

app.use(logErrors);

/* ************************************************************************* */

export default app;
