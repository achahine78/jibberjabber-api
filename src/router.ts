import { Router } from "express";
import { createPost, getAllPosts, getPost } from "./handlers/post";

const router = Router();

router.get("/post", getAllPosts);

router.get("/post/:id", getPost);

router.post("/post", createPost);

router.delete("/post/:id", (req, res) => {});

export default router;