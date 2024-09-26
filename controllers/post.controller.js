import { sendCmmentNotificationEmail } from "../emails/emailhandlers.js";
import cloudinary from "../lib/cloudinary.js";
import Notification from "../model/notification.model.js";
import Post from "../model/post.model.js";
export async function getFeedPosts(req, res) {
  try {
    const posts = await Post.find({
      //$in means in the array of connections  of user in req.user.connections
      // author: { $in: [...req.user.connections, req.user._id] },
    })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name username profilePicture ")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    
    res.status(500).json(error.message);
  }
}

export async function createPost(req, res) {
  try {
    const { content, image } = req.body;
    let createPosts;
    if (image) {
      const result = await cloudinary.uploader.upload(image);
      createPosts = new Post({
        author: req.user._id,
        content,
        image: result.secure_url,
      });
    } else {
      createPosts = new Post({
        author: req.user._id,
        content,
      });
    }
    if (!createPosts) {
      console.log("faild to create post");
      res.status.json({ message: "faild to create post" });
    }
    await createPosts.save();
    res.status(201).json(createPosts);
  } catch (error) {
    
    res.status(500).json({ message: "faild to create post" });
  }
}

export async function deletePost(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    // check if the user is authorized to delete the post
    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "you not allowed to delete another user post" });
    }

    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: " post not deleted" });
  }
}

export async function getPostById(req, res) {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name username profilePicture  headline");
   

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createComment(req, res) {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            user: req.user._id,
            content,
          },
        },
      },
      { new: true }
    ).populate("author", "name username profilePicture headline");

    // create a notification if the comment is not from the post author
    if (post.author._id.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        recipient: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: postId,
      });

      await notification.save();

      try {
        const postUrl = process.env.CLIENT_URL + "/post/" + postId;
        await sendCmmentNotificationEmail(
          post.author.email,
          post.author.name,
          req.user.name,
          content,
          postUrl
        );
      } catch (error) {
        console.log(error);
      }
    }
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function likePost(req, res) {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user._id;
    if (post.likes.includes(userId)) {
      // unlike the post remove liks islike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // like the post
      post.likes.push(userId);

      if (post.author.toString() !== userId.toString()) {
        const notification = new Notification({
          recipient: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });

        await notification.save();
      }
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
