import { prisma } from "../db/prisma";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

export const createUser = async (req, res) => {
  if (!req.body.username) {
    res.status(422);
    res.json({ message: "Username field is missing." })
    return;
  }

  if (!req.body.password) {
    res.status(422);
    res.json({ message: "Password field is missing." })
    return;
  }

  if (!req.body.email) {
    res.status(422);
    res.json({ message: "Email field is missing." })
    return;
  }

  const username = req.body.username;
  const password = await hashPassword(req.body.password);
  const email = req.body.email;

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    const token = createJWT(user);
    res.json({ token });
  } catch (e) {
    res.status(409);
    res.json({ message: "Email or username are already taken." });
  }
};

export const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    res.status(401);
    res.json({
      message: "Invalid username and password combination",
    });
    return;
  }

  const isValid = await comparePasswords(password, user.password);

  if (!isValid) {
    res.status(401);
    res.json({
      message: "Invalid username and password combination",
    });
    return;
  }

  const token = createJWT(user);
  res.json({ token });
};
