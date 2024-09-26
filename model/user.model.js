import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
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
    profilePicture: {
      type: String,
      default: "",
    },
    bannerImage: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "musdar user",
    },
    location: {
      type: String,
      default: "Earth",
    },
    about: {
      type: String,
      default: "",
    },
    skills: [String],
    experience: [
      {
        title: String,
        company: String,
        endDate: Date,
        tartDate: Date,
        description: String,
      },
    ],

    education: [
      {
        school: String,
        fieldofstudy: String,
        endYear: Date,
        tartYear: Date,
        description: String,
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  { timestamps: true }
);

export default mongoose.model("User", userSchema);
