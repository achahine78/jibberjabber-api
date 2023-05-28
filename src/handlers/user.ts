import { prisma } from "../db/prisma";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

export const createUser = async (req, res) => {
  const username = req.body.username;
  const password = await hashPassword(req.body.password);
  const email = req.body.email;
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });

  const token = createJWT(user);
  res.json({ token });
};

export const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  const isValid = await comparePasswords(password, user.password);

  if (!isValid) {
    res.status(401);
    res.json({
      message: "Invalid username and password combination",
    });
  }

  const token = createJWT(user);
  res.json({ token });
};
