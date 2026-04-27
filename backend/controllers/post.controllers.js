import { io } from "../index.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.models.js";

export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    let newPost;

    if (req.file) {
      const image = await uploadOnCloudinary(req.file.path);
      newPost = await Post.create({
        author: req.userId,
        description,
        image,
      });
    } else {
      newPost = await Post.create({
        author: req.userId,
        description,
      });
    }

    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ message: "createPost error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.find()
      .populate("author", "firstName lastName profileImage headline userName")
      .populate("comments.user", "firstName lastName profileImage headline")
      .sort({ createdAt: -1 });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "getPost error" });
  }
};

export const like = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    if (post.like.includes(userId)) {
      post.like = post.like.filter((id) => id.toString() !== userId);
    } else {
      post.like.push(userId);

      if (post.author.toString() !== userId) {
        await Notification.create({
          reciever: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });
      }
    }

    await post.save();
    io.emit("likeUpdated", { postId, likes: post.like });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "like error" });
  }
};

export const comment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const { content } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { content, user: userId } } },
      { new: true },
    ).populate("comments.user", "firstName lastName profileImage headline");

    if (post.author.toString() !== userId) {
      await Notification.create({
        reciever: post.author,
        type: "comment",
        relatedUser: userId,
        relatedPost: postId,
      });
    }

    io.emit("commentAdded", { postId, comm: post.comments });
     return res.status(200).json({
       comment :post.comments,
     });
    // return res.status(200).json(post);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "comment error" });
  }
};
