const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { createPost, getAllPosts, editPost, deletePost, like, commentOnPost, getComments } = require("../controllers/postController");

const router = express.Router();

//create post
router.post('/', verifyToken, createPost);

//getAllPosts
router.get('/', getAllPosts);

//edit post
router.patch('/:id/edit', verifyToken, editPost);

//delete post
router.delete('/:id/delete', verifyToken, deletePost);

//like/unlike posts
router.post('/:id/like', verifyToken, like);

//create comment
router.post('/:id/comment', verifyToken, commentOnPost);

//get comments
router.get('/:id/comment', getComments);

module.exports = router;