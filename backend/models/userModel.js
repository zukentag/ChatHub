const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { hash } = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestaps: true }
);

// to compare entered password and encrypted password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Before Saving Encrypt the password
userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await hash(this.password, salt);
  }
});
const User = mongoose.model("User", userSchema);

module.exports = User;
