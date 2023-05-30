import { prisma } from "../db/prisma";
import jwt from "jsonwebtoken";

export const createUpvote = async (req, res) => {
  const postId = req.params.postId;
  const bearer = req.headers.authorization;
  const [, token] = bearer.split(" ");
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  const userId = id;
  try {
    const downvote = await prisma.downvote.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (downvote) {
      await prisma.downvote.delete({
        where: {
          id: downvote.id,
        },
      });
    }

    const upvote = await prisma.upvote.create({
      data: {
        postId,
        userId,
      },
    });

    res.json({ upvote });
  } catch (e) {
    res.status(409);
    res.json({ message: "You can only upvote once" });
  }
};

export const createDownvote = async (req, res) => {
  const postId = req.params.postId;
  const bearer = req.headers.authorization;
  const [, token] = bearer.split(" ");
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  const userId = id;
  try {
    const upvote = await prisma.upvote.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (upvote) {
      await prisma.upvote.delete({
        where: {
          id: upvote.id,
        },
      });
    }

    const downvote = await prisma.downvote.create({
      data: {
        postId,
        userId,
      },
    });

    res.json({ downvote });
  } catch (e) {
    res.status(409);
    res.json({ message: "You can only downvote once" });
  }
};
