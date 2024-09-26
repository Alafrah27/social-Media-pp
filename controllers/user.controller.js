import cloudinary from "../lib/cloudinary.js";
import User from "../model/user.model.js";

export async function getSuggestedConnections(req, res) {
  try {
    const currentUser = await User.findById(req.user._id).select("connections");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const suggestedUser = await User.find({
      //$ne means not equal
      // $nin means not in
      _id: { $ne: req.user_id, $nin: currentUser.connections },
    })
      // select means
      .select(" name username headline profilePicture")
      .limit(5);
    res.json(suggestedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPuplicProfile(req, res) {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// export async function updateProfile(req, res) {
//   try {
//     const allowedFields = [
//       "name",
//       "username",
//       "headline",
//       "about",
//       "location",
//       "profilepicture",
//       "bannerImage",
//       "skills",
//       "experience",
//       "education",
//     ];

//     const updatedData = {};

//     for (const field of allowedFields) {
//       if (req.body[field]) {
//         updatedData[field] = req.body[field];
//       }
//     }

//     if (req.body.profilepicture) {
//       const result = await cloudinary.uploader.upload(req.body.profilepicture);
//       updatedData.profilePicture = result.secure_url;
//     }

//     if (req.body.bannerImage) {
//       const result = await cloudinary.uploader.upload(req.body.bannerImg);
//       updatedData.bannerImage = result.secure_url;
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { $set: updatedData },
//       { new: true }
//     ).select("-password");

//     res.json(user);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

export async function updateProfile(req, res) {
  try {
    const allowedFields = [
      "name",
      "username",
      "headline",
      "about",
      "location",
      "profilePicture", // Changed to match updatedData later
      "bannerImage", // Ensure this matches the field name
      "skills",
      "experience",
      "education",
    ];

    const updatedData = {};

    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }

    if (req.body.profilePicture) {
      // Ensure field names match
      try {
        const result = await cloudinary.uploader.upload(
          req.body.profilePicture
        );
        updatedData.profilePicture = result.secure_url;
      } catch (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        return res
          .status(400)
          .json({ message: "Error uploading profile picture" });
      }
    }

    if (req.body.bannerImage) {
      // Ensure field names match
      try {
        const result = await cloudinary.uploader.upload(req.body.bannerImage); // Corrected key access
        updatedData.bannerImage = result.secure_url;
      } catch (uploadError) {
        console.error("Error uploading banner image:", uploadError);
        return res
          .status(400)
          .json({ message: "Error uploading banner image" });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedData },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
