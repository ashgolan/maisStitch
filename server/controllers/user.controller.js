import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { env } from "process";
import jwt from "jsonwebtoken";
const secretKey = env.ACCESS_TOKEN_SECRET;
export const userControllers = {
  createUser: async (req, res) => {
    try {
      let user;
      console.log(req.body);
      if (!req.body.key || req.body.key !== process.env.REACT_APP_ADMIN)
        throw new Error("לא הוכנס מפתח הוספת או שינוי נתונים");
      if (req.body.role === "Admin") {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        user = await User.create({
          ...req.body,
          password: hash,
          key: "unknown",
        });
      }
      if (!user) throw Error("שגיאה  בהוספת הנתונים");

      res.status(200).send(user);
    } catch (e) {
      res.status(400).send(e.message);
    }
  },
  getAllUsers: async (req, res, next) => {
    try {
      // let users = await User.find({ firstName: { $nin: ["Admin"] } });
      let users = await User.find();
      // users = users.filter((user) => user.firstName !== "Admin");
      if (!users) throw Error("No users in database");
      res.status(200).send(users);
    } catch (e) {
      res.status(400).send(e.message);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      if (!req.body.key || req.body.key !== process.env.REACT_APP_ADMIN)
        throw Error("לא הוכנס מפתח הוספת או שינוי נתונים");
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const user = await User.findByIdAndUpdate(
        { _id: req.body._id },
        { $set: { ...req.body, password: hash } }
      );
      if (!user) throw Error("שגיאה בשליפת הנתונים");
      res.status(StatusCodes.OK).send(user);
    } catch (e) {
      res.status(400).send(e.message);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      if (!req.body.key || req.body.key !== process.env.REACT_APP_ADMIN)
        throw Error("לא הוכנס מפתח הוספת או שינוי נתונים");
      const user = await User.findByIdAndDelete({ _id: req.body._id });
      if (!user) throw Error("No data");
      res.status(200).send(user);
    } catch (e) {
      res.status(400).send(e.message);
    }
  },
  getUserById: async (req, res, next) => {
    try {
      let user = await User.findById({ _id: req.params.id });
      if (!user) {
        throw Error("No users in database");
      }
      res.status(StatusCodes.OK).send(user);
    } catch (e) {
      res.status(400).send(e.message);
    }
  },
  getUser: async (req, res, next) => {
    res.status(StatusCodes.OK).send(req.user);
  },
  login: async (req, res) => {
    try {
      const adminUser = await User.findOne({ email: req.body.email });
      if (!adminUser) throw Error("user not found!!");
      const { accessToken, refreshToken } = await adminUser.generateAuthToken();
      const isMatched = await bcrypt.compare(
        req.body.password,
        adminUser.password
      );
      if (!isMatched) {
        throw Error("user not found!!");
      } else {
        res.send({ accessToken, refreshToken, adminUser });
      }
    } catch (e) {
      res.send(e.message);
    }
  },
  refreshAccessToken: (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        return res
          .status(400)
          .json({ error: "Bad Request - Refresh Token missing" });
      }
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, secretKey);
      // Generate a new access token
      const newAccessToken = jwt.sign(
        { _id: decoded._id.toString() },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30min" }
      );

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      return res
        .status(403)
        .json({ error: "Forbidden - Refresh Token invalid or expired" });
    }
  },

  logout: async (req, res) => {
    try {
      if (!req.body.key || req.body.key !== process.env.REACT_APP_ADMIN)
        throw Error("לא הוכנס מפתח נכון או המפתח לא קיים");
      const user = await User.findOne({ _id: req.body._id });
      user.tokens = user.tokens.filter((token) => {
        return token.accessToken !== req.body.accessToken;
      });
      await user.save();
      res.send("logged out successfully");
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
  logoutAll: async (req, res) => {
    try {
      if (!req.body.key || req.body.key !== process.env.REACT_APP_ADMIN)
        throw Error("לא הוכנס מפתח נכון או המפתח לא קיים");
      const user = await User.findOne({ _id: req.params.id });
      if (!user) throw Error("user not found");
      user.tokens = [];
      await user.save();
      res.send("loged out succefully");
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
};
