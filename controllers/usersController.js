const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mailer = require("../utils/mailer");
const { tokensecret, url } = require("../config");

//reg user
exports.registerUser = asyncHandler(async (req, res) => {
  // get user details from req body
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  // check if user already exists
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // create hashed password
  const hashedpwd = await bcrypt.hash(password, salt);

  //   create new user with details
  const user = await User.create({
    username,
    password: hashedpwd,
    email,
    role: "manager",
  });

  if (!user) {
    res.status(400);
    throw new Error("Trouble creating user");
  }

  if (user) {
    res.status(200).json(user);
  }
});

// @route POST /api/auth/login
// desc   Register User[admin, user, manager, staff]
// access Public

exports.loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // check if username or password exists
  if (!username || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  // check if user exists
  const user = await User.findOne({ username });

  // throw error if user does not exist
  if (!user) {
    res.status(400);
    throw new Error("User does not exist, user must register");
  }

  // check that user has correct password
  const passwordExists = await bcrypt.compare(password, user.password);
  if (!passwordExists) {
    res.status(400);
    throw new Error("Username or password invalid");
  }

  // generate token
  const token = jwt.sign({ id: user._id }, tokensecret, {
    expiresIn: "1d",
  });

  res.status(200).json({
    _id: user._id,
    email: user.email,
    username: user.username,
    token: token,
  });
});

// @route POST /api/auth/resetPassword
// desc   ResetPassword
// access Public
exports.resetPassword = asyncHandler(async (req, res) => {
  // extract user email
  const { email } = req.body;

  // check if user email exists
  const user = await User.findOne({ email });

  // if user does not exist
  if (!user) {
    res.status(400);
    throw new Error("User email does not exists, please register first");
  }

  // send mail containing link for new password
  const generatedLink = `${url}api/auth/resetpassword/user/${user._id}`;

  try {
    mailer(user.email, "Password Reset Link", generatedLink);
    res
      .status(200)
      .json({ success: "Password reset link has been sent successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("There was an error sending email");
  }
});

// complete password reset

exports.completeResetPassword = asyncHandler(async (req, res) => {
  try {
    // get password from request body
    const { password, password2 } = req.body;

    // check if passwords dont match
    if (password !== password2) {
      res.status(400);
      throw new Error("Sorry passwords should match");
    }

    const { id } = req.params;
    console.log(id);

    // find user by their id
    const user = await User.findOne({ _id: id });
    console.log(user);
    // check if passwords do not match
    const isMatchedPasswords = await bcrypt.compare(user.password, password);
    if (isMatchedPasswords) {
      res.status(400);
      throw new Error("Sorry, you cannot reset with old password");
    }
    // generate salt
    const salt = await bcrypt.genSalt(10);
    // create hashedpwd
    const hashedPwd = await bcrypt.hash(password, salt);
    // update user password with new password
    user.password = hashedPwd;
    await user.save();
    res
      .status(200)
      .json({ success: "Your new password has been set successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("Sorry, failed to reset user password");
  }
});
