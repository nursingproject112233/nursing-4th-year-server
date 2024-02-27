import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/users.js";
import Student from "../models/students.js";

export const isCurrentUserAdmin = async (userId) => {
  const user = await User.findById(userId);
  return user && user.isAdmin;
};

export const testUser = async (req, res) => {
  try {
    return res.json({
      message: "tested!",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getUser = async (req, res) => {
  try {
    const user = req.user;

    return res.json({
      id: user._id,
      displayName: user.displayName,
      username: user.username,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// To get details of loggedIn user, whether a user is a student or admin
export const getUserDetails = async (req, res) => {
  try {
    const user = req.user;

    console.log("====================================");
    console.log("user", user);
    console.log("====================================");
    if (!user) {
      return res.json({ loggedin: false });
    }
    const user_data = {
      id: user._id,
      displayName: user.displayName,
      username: user.username,
      type: "admin",
    };
    if (user.type == "student") {
      user_data["type"] = "student";
      const Studentrec = await Student.findOne({ email: user.username });
      return res
        .status(200)
        .json({ loggedin: true, user: user_data, student_data: Studentrec });
    }
    return res.json({ loggedin: true, user: user_data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, password, confirmPassword, type } = req.body;
    let { displayName } = req.body;

    if (!displayName) displayName = username;

    if (!displayName || !username || !password || !confirmPassword || !type) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    // if (password.length < 5) {
    //     return res.status(400)
    //         .json({ message: "Password should be least 5 characters" });
    // }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Confirm password does not match with password" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({
      username,
      password: passwordHash,
      displayName,
      type,
    });
    await user.save();
    res.json({ message: "Successfully registered" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//new login - session working
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Email or password is missing" });
    }

    User.findOne({ username })
      .then(async (user) => {
        if (!user) {
          return res
            .status(400)
            .json({ message: "No account found for this username" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const token = jwt.sign(
          {
            data: user,
          },
          process.env.JWT_SECRET
        );

        // localStorage.setItem("userToken", token);
        // Set session data
        req.user = user;
        return res.json({
          user: user,
          token: token,
        });
        // Save the session and send the response
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          return res.json({
            user: user,
          });
        });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return res.status(500).json({ error: error.message });
  }
};

//old login - session not working
// export const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ message: "Email or password is missing" });
//     }

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ message: "No account found for this username" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     let savedata = user;
//     console.log("====================================");
//     console.log(savedata);
//     console.log("====================================");
//     req.session.isAuth = true;
//     req.user = savedata;
//     req.session.save();

//     res.json({
//       user: {
//         id: user._id,
//         displayName: user.displayName,
//         username: user.username,
//         type: user.type,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

export const logoutUser = async (req, res) => {
  try {
    req.session.destroy();
    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
