import jwt from "jsonwebtoken";
import argon2 from "argon2";
import type { RequestHandler } from "express";

// Import access to data
import usersRepository from "./usersRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all items
    const users = await usersRepository.readAll();

    // Respond with the items in JSON format
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const usersId = Number(req.params.id);
    const Users = await usersRepository.read(usersId);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (Users == null) {
      res.sendStatus(404);
    } else {
      res.json(Users);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const user = await usersRepository.readByEmailWithPassword(req.body.email);

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    const verified = await argon2.verify(user.password_hash, req.body.password);

    if (!verified) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // ✅ Génération du token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo,
      },
      process.env.JWT_SECRET || "secretKey", // ⚠️ mets une vraie clé secrète dans ton .env
      { expiresIn: "2h" }
    );

    // ✅ Réponse au front : token + infos utilisateur
    res.json({
      token,
      user: {
        id: user.id,
        pseudo: user.pseudo,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};


const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10 /* 19 Mio en kio (19 * 1024 kio) */,
  timeCost: 2,
  parallelism: 1,
};

const hashPassword: RequestHandler = async (req, res, next) => {
  try {
    // Extraction du mot de passe de la requête
    const { password } = req.body;

    // Hachage du mot de passe avec les options spécifiées
    const hashedPassword = await argon2.hash(password, hashingOptions);

    // Remplacement du mot de passe non haché par le mot de passe haché dans la requête
    req.body.password_hash = hashedPassword;

    // Oubli du mot de passe non haché de la requête : il restera un secret même pour notre code dans les autres actions
    req.body.password = undefined;

    next();
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    const newUser = {
      email: req.body.email,
      avatar_url: req.body.avatar_url || null,
      zip_code: req.body.zip_code || null,
      last_name: req.body.last_name,
      first_name: req.body.first_name,
      password_hash: req.body.password_hash,
      pseudo: req.body.pseudo,
      is_admin: req.body.is_admin ?? false,
    };

    // Vérifie si un utilisateur existe déjà avec cet email
    const existingUser = await usersRepository.readByEmailWithPassword(newUser.email);
    if (existingUser) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }

    // Création dans la base
    const insertId = await usersRepository.create(newUser);

    // Génère un token JWT
    const token = jwt.sign(
      { id: insertId, email: newUser.email, pseudo: newUser.pseudo },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "2h" }
    );

    // Réponse complète au frontend
    res.status(201).json({
      token,
      user: {
        id: insertId,
        email: newUser.email,
        pseudo: newUser.pseudo,
      },
    });
  } catch (err) {
    next(err);
  }
};
export default { browse, read, add, hashPassword, login };
