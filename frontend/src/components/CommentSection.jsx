import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/axiosConfig";
import { useToast } from "../context/ToastContext";
import { timeAgo } from "../utils/timeUtils";

const CommentSection = ({ postId, comments: initialComments = [], onCommentAdded }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const data = await apiClient.get(`/post/${postId}/comment`, token);
      setComments(data.data || data.comments || []);
    } catch (err) {
      console.error("Load comments error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await apiClient.post(`/post/${postId}/comment`, { text: newComment }, token);

      const created = res.data || res.comment || {
        _id: Date.now().toString(),
        username: user?.name || "You",
        text: newComment,
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [...prev, created]);
      setNewComment("");
      showToast("Comment added!");
      onCommentAdded();
    } catch (err) {
      showToast("Failed to add comment", "error");
      console.error("Add comment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mt-3">
      {/* Input box */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Add a comment..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !newComment.trim()}
          className="px-3 py-2 bg-[#0a66c2] text-white rounded-full disabled:opacity-60"
          title="Post comment"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c._id} className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold">
              {String(c.username || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div>
                <div className="text-sm font-medium text-gray-900">{c.username || "Unknown"}</div>
                <div className="text-xs text-gray-500">{timeAgo(c.createdAt)}</div>
              </div>
              <p className="mt-1 text-sm text-gray-800">{c.text}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-sm text-gray-500">No comments yet.</div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
