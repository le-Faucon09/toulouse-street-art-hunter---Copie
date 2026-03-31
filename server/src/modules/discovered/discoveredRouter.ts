import express from "express";
import { upload } from "../../middlewares/Multer";
import discoveredActions from "./discoveredActions";

const router = express.Router();

router.post("/", upload.single("photo"), discoveredActions.add);

export default router;
