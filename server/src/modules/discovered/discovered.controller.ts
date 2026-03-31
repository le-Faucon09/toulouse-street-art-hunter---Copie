import path from "node:path";
import type { Request, Response } from "express";
import { upload } from "../../middlewares/Uploads"; // 👍 utile si utilisé dans ta route
import discoveredRepository from "../discovered/discoveredRepository"; // ✅ Import par défaut

export const createDiscovered = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, artworkId } = req.body;

    if (!req.file) {
      res.status(400).json({ error: "Aucune image n'a été téléchargée." });
      return;
    }

    const imagePath = path.join("uploads", req.file.filename); // ✅ chemin relatif

    const newDiscovered = await discoveredRepository.create({
      user_id: Number(userId),
      artwork_id: Number(artworkId),
      photo_url: imagePath,
      discovered_at: new Date(),
    });

    res.status(201).json(newDiscovered);
  } catch (error) {
    console.error("Erreur lors de la création de discovered :", error);
    res.status(500).json({ error: "Erreur serveur lors de la création." });
  }
};
