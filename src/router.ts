import { Router } from "express";
import { createPost, getPost } from "./handlers/post";

const router = Router();

router.get("/post", async (req, res) => {

});

router.get("/post/:id", getPost);

router.post("/post", createPost);

router.delete("/post/:id", (req, res) => {});

export default router;