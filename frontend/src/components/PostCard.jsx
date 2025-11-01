import React, { useState } from "react";
import { ThumbsUp, MessageSquare, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/axiosConfig";
import { useToast } from "../context/ToastContext";
import { timeAgo } from "../utils/timeUtils";
import CommentSection from "./CommentSection";

const PostCard = ({ post, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [likeCount, setLikeCount] = useState(post.likesCount || 0);
  const [isLiked, setIsLiked] = useState(post.alreadyLiked || false);

  const { token, user } = useAuth();
  const { showToast, showConfirmToast } = useToast();

  const isOwnPost =
    post.user?._id === user?._id ||
    post.user === user?._id ||
    post.username === user?.name;

  const handleLike = async () => {
    try {
      const res = await apiClient.post(`/post/${post._id}/like`, {}, token);
      setIsLiked(res.alreadyLiked);
      setLikeCount(res.likesCount);
      onUpdate();
    } catch (err) {
      showToast("Failed to like post", "error");
      console.error("Like error:", err);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim()) {
      showToast("Post cannot be empty", "error");
      return;
    }
    try {
      await apiClient.patch(`/post/${post._1d || post._id}/edit`, { text: editText }, token);
      setIsEditing(false);
      showToast("Post updated!");
      onUpdate();
    } catch (err) {
      showToast("Failed to update post", "error");
      console.error("Edit error:", err);
    }
  };

  const handleDelete = () => {
    showConfirmToast("Delete this post?", async () => {
      try {
        await apiClient.delete(`/post/${post._id}/delete`, token);
        showToast("Post deleted!");
        onUpdate();
      } catch (err) {
        showToast("Failed to delete post", "error");
        console.error("Delete error:", err);
      }
    });
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 hover:shadow-md transition">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="w-11 h-11 bg-[#0a66c2] rounded-full flex items-center justify-center text-white font-semibold">
              {post.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.username || "Unknown"}</h3>
              <p className="text-xs text-gray-500">
                {timeAgo(post.createdAt)} {post.isEdited && <span className="ml-1 text-gray-400">(edited)</span>}
              </p>
            </div>
          </div>

          {isOwnPost && (
            <div className="flex gap-2 text-gray-500">
              <button onClick={() => setIsEditing((s) => !s)} title="Edit">
                <Edit2 size={16} />
              </button>
              <button onClick={handleDelete} title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 text-gray-800">
          {isEditing ? (
            <>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#0a66c2]"
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(post.text);
                  }}
                  className="px-3 py-1 rounded border border-gray-200"
                >
                  Cancel
                </button>
                <button onClick={handleEdit} className="px-3 py-1 bg-[#0a66c2] text-white rounded">
                  Save
                </button>
              </div>
            </>
          ) : (
            <p className="whitespace-pre-wrap">{post.text}</p>
          )}
        </div>

        <div className="flex justify-between items-center text-gray-600 border-t border-gray-100 mt-3 pt-3">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 ${isLiked ? "text-[#0a66c2]" : "hover:text-[#0a66c2]"}`}
            >
              <ThumbsUp size={18} />
              <span className="text-sm">{likeCount}</span>
            </button>

            <button onClick={() => setShowComments((s) => !s)} className="flex items-center gap-2 hover:text-[#0a66c2]">
              <MessageSquare size={18} />
              <span className="text-sm">{post.comments?.length || 0}</span>
            </button>
          </div>

          <div className="text-xs text-gray-400">{/* space for any meta */}</div>
        </div>

        {showComments && (
          <div className="mt-3">
            <CommentSection postId={post._id} comments={post.comments} onCommentAdded={onUpdate} />
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
