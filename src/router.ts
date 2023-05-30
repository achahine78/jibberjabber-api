import { Router } from "express";
import { createPost, getAllPosts, getPost } from "./handlers/post";
import { createDownvote, createUpvote } from "./handlers/vote";

const router = Router();

router.get("/post", getAllPosts);
router.get("/post/:id", getPost);
router.post("/post", createPost);
router.delete("/post/:id", (req, res) => {});

router.post("/upvote/:postId", createUpvote);
router.post("/downvote/:postId", createDownvote);

export default router;