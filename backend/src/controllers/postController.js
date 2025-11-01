const Post = require("../models/postModel");

//create post
const createPost = async (req, res) => {
    try {
        const { id, name } = req.user;
        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Post content cannot be empty" });
        }

        const newPost = new Post({
            user: id,
            username: name,
            text,
        })

        const savedPost = await newPost.save();

        return res.status(201).json({ success: true, message: "Post created successfully", data: savedPost });
    } catch (error) {
        console.error("Error in createPost controller: ", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

//get all posts
const getAllPosts = async (req, res) => {
  try {
    // Populate user field with 'name' only
    const posts = await Post.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found",
        data: []
      });
    }

    const userId = req.user ? req.user.id : null;

    // Attach likesCount, alreadyLiked, username, and createdAt
    const updatedPosts = posts.map(post => ({
      ...post._doc,
      username: post.user?.name || post.username, // ensure fallback
      likesCount: post.likes.length,
      alreadyLiked: userId ? post.likes.includes(userId) : false,
      createdAt: post.createdAt
    }));

    return res.status(200).json({
      success: true,
      message: "All posts fetched successfully",
      data: updatedPosts
    });

  } catch (error) {
    console.error("Error in getAllPosts controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


//edit post (only user who created that post)
const editPost = async (req, res) => {
    try {
        const { text } = req.body;
        const { id } = req.params;
        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Post cant be empty!" });
        }
        const post = await Post.findById(id);
        if (post.text === text.trim()) {
            return res.status(400).json({ message: "Post content is unchanged" });
        }

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only edit your posts" });
        }
        post.text = text;
        post.isEdited = true;
        const updatedPost = await post.save();
        return res.status(200).json({ success: true, message: "Post edited successfully", data: updatedPost });
    } catch (error) {
        console.log("Error in editPost controller: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

//delete post (only user who created can delete)
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your post" });
        }
        await Post.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error in deletePost controller: ", error);
        return res.status(500).json("Internal Server Error");
    }
}

//post likes
const like = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // check if user already liked
        const alreadyLiked = post.likes.includes(req.user.id);
        let message = "";

        if (alreadyLiked) {
            // unlike
            post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
            message = "Post unliked";
        } else {
            // like
            post.likes.push(req.user.id);
            message = "Post liked";
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message,
            alreadyLiked: !alreadyLiked,
            likesCount: post.likes.length
        });

    } catch (error) {
        console.log("Error in like controller: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

//create comments on post
const commentOnPost = async (req, res) => {
    try {
        const { id } = req.params; // post ID
        const { text } = req.body;

        // Validation
        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Construct new comment
        const newComment = {
            user: req.user.id,
            username: req.user.name, // make sure middleware attaches user.name
            text: text.trim(),
            createdAt: new Date()
        };

        // Add comment to post
        post.comments.push(newComment);
        await post.save();

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: newComment
        });

    } catch (error) {
        console.error("Error in commentOnPost controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

//get comments
const getComments = async (req, res) => {
    try {
        const { id } = req.params; // post ID
        const post = await Post.findById(id).select("comments");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Sort comments by newest first (optional)
        const comments = post.comments.sort((a, b) => b.createdAt - a.createdAt);

        return res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            count: comments.length,
            data: comments
        });

    } catch (error) {
        console.error("Error in getComments controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = { createPost, getAllPosts, editPost, deletePost, like, commentOnPost, getComments };