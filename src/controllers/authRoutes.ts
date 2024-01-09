import { Authentication, random } from "../Authentication/Authentication";
import { getUserByEmail, createUser } from "../db/user";
import express from "express";

export const login = async (req: express.Request, res: express.Response) => {

  try {
    const {email , password} = req.body;

    if(!email || !password) {
     return  res.status(400).json({message : "Invalid email or password"})
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password ');
    if(!user) {
      return res.status(404).json({message : "User not found"})
    }

    
    const expectedHashedPassword = await Authentication(user.authentication.salt , password)

    if(expectedHashedPassword !==  user.authentication.password) {
            return res.status(404).json({message : "invalid passowrd" + expectedHashedPassword})
    }

    const salt = random()
    const user.authentication.sessionToken =  Authentication(salt , user._id.toString());
    await user.save();

    res.cookie(('km' , user.authentication.sessionToken, {domain : 'localhost'}))

    return res.status(200).json({message: "Success"})

  } catch (err) {

  }
}

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "Enter username, password, and email" });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const salt = random();
    const hashedPassword = await Authentication(salt, password);

    const user = await createUser({
      username,
      email,
      authentication: {
        password: hashedPassword,
        salt,
      },
    });

    res.status(200).json({ message: "User created successfully" }).send(user).end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
};
