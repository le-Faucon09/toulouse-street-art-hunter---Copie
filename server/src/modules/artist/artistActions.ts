import type { RequestHandler } from "express";

// Import access to data
import artistRepository from "./artistRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all artists
    const artists = await artistRepository.readAll();

    // Respond with the artists in JSON format
    res.json(artists);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific artist based on the provided ID
    const artistId = Number(req.params.id);
    const artist = await artistRepository.read(artistId);

    // If the artist is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the artist in JSON format
    if (artist == null) {
      res.sendStatus(404);
    } else {
      res.json(artist);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extract the artist data from the request body
    const newArtist = {
      name: req.body.name,
      bio: req.body.bio,
      avatar_url: req.body.avatar_url,
      profile_image_url: req.body.profile_image_url,
      created_at: req.body.created_at,
    };

    // Create the artist
    const insertId = await artistRepository.create(newArtist);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted artist
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browse, read, add };
