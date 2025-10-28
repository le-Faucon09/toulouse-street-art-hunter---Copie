import express from "express";
// import { upload } from "./middlewares/multer";
import artistActions from "./modules/artist/artistActions";
import artworkActions from "./modules/artwork/artworkActions";
import discoveredActions from "./modules/discovered/discoveredActions";
import discoveredRouter from "./modules/discovered/discoveredRouter";
import usersActions from "./modules/user/usersActions";




const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes

// router.post("/api/discovered", upload.single("photo"), discoveredActions.add);
router.use("/discovered", discoveredRouter);

router.get("/api/users", usersActions.browse);
router.get("/api/users/:id", usersActions.read);
router.post(
  "/api/users/inscription",
  usersActions.hashPassword,
  usersActions.add,
);
router.post("/api/users/login", usersActions.login);

router.get("/api/artist", artistActions.browse);
router.get("/api/artist/:id", artistActions.read);
router.post("/api/artist", artistActions.add);

router.get("/api/artworks", artworkActions.browse);
router.get("/api/artworks/:id", artworkActions.read);
router.post("/api/artworks", artworkActions.add);

export default router;
