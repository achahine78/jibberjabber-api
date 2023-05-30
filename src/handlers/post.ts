import { prisma } from "../db/prisma";
import jwt from "jsonwebtoken";

export const createPost = async (req, res) => {
  const bearer = req.headers.authorization;
  const [, token] = bearer.split(" ");
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  if (!req.body.content) {
    res.status(422);
    res.json({ message: "Content field is missing." });
    return;
  }

  try {
    const post = await prisma.post.create({
      data: {
        content: req.body.content,
        createdById: id,
      },
    });
    res.json({ post });
  } catch (e) {
    res.status(500);
    res.json({
      message: "Internal server error",
    });
    return;
  }
};

export const getPost = async (req, res) => {
  if (!req.params.id) {
    res.status(422);
    res.json({ message: "id field is missing." });
    return;
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        upvotes: true,
        downvotes: true,
      },
    });

    if (!post) {
      res.status(404);
      res.json({
        message: "Post not found",
      });
      return;
    }

    res.json({
      ...post,
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length,
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({
      message: "Internal server error",
    });
    return;
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        upvotes: true,
        downvotes: true,
      },
    });
    const postsWithVotesCounted = posts?.map((post) => ({
      ...post,
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length,
    }));
    res.json({ posts: postsWithVotesCounted });
  } catch (e) {
    res.status(500);
    res.json({
      message: "Internal server error",
    });
    return;
  }
};
