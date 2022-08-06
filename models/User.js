const mongoose = require("mongoose");

// create user schema
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "staff", "user"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("authUser", UserSchema);
