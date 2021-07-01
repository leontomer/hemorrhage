const express = require("express");
const router = express.Router();
const User = require("../../models/user.model");
const Log = require("../../models/log.model");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const userAuth = require("../../middleware/userAuth");
const adminAuth = require("../../middleware/adminAuth");
const doctorAuth = require("../../middleware/doctorAuth");
const logs = require("../../models/log.model");

router.get("/", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      newlog = new Log({
        actionName: "Invalid Login Details",
        user: "no user",
      });
      await newlog.save();
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        newlog = new Log({
          actionName: "Invalid Login-Email Doesn't exist",
          user: "no user",
        });
        await newlog.save();
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Login details" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        newlog = new Log({
          actionName: "Invalid Login-Wrong Password",
          user: "no user",
        });
        await newlog.save();
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Login details" }] });
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        async (err, token) => {
          if (err) throw err;
          newlog = new Log({ actionName: "Login", user: user.email });
          await newlog.save();
          res.json({ token, role: user.role });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }
);

// router.post(
//   "/register",
//   [
//     check("firstName", "First name is required").not().isEmpty(),
//     check("lastName", "Last name is required").not().isEmpty(),
//     check("email", "Please include a valid email").normalizeEmail().isEmail(),
//     check(
//       "password",
//       "Password must be minimum 6 letters long, and no more then 20"
//     ).isLength({ min: 8, max: 20 }),
//     check("password", "Password must contain at least one letter").matches(
//       /([a-zA-Z])+([ -~])*/
//     ),
//   ],

//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { firstName, lastName, email, password } = req.body;
//     try {
//       let user = await User.findOne({ email });
//       if (user) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: "User already exists" }] });
//       }

//       user = new User({
//         firstName,
//         lastName,
//         email,
//         password,
//         role: "Doctor",
//       });
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);
//       await user.save();
//       const payload = {
//         user: {
//           id: user.id,
//         },
//       };

//       jwt.sign(
//         payload,
//         config.get("jwtSecret"),
//         { expiresIn: 36000 },
//         async (err, token) => {
//           if (err) throw err;
//           newlog = new Log({ actionName: "Register", user: user.email });
//           await newlog.save();
//           res.json({ token });
//         }
//       );
//     } catch (err) {
//       console.error(err);
//       res.status(500).send(err.message);
//     }
//   }
// );

router.get(
  "/getRole",

  userAuth,

  async (req, res) => {
    try {
      const userID = req.user.id;
      const user = await User.findById(userID).select("-password");

      res.json(user.role);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }
);

router.post(
  "/logout",

  userAuth,

  async (req, res) => {
    try {
      const userID = req.user.id;
      const user = await User.findById(userID).select("-password");
      newlog = new Log({ actionName: "Logout", user: user.email });
      await newlog.save();
      res.json("ok");
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;
