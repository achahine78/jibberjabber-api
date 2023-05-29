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
        upvotes: 0,
        downvotes: 0,
      },
    });
    res.json({ post });
  } catch (e) {
    res.status(401);
    res.json({
      message: "Invalid post",
    });
    return;
  }
};
