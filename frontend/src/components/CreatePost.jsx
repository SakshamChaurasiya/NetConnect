import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/axiosConfig";
import { useToast } from "../context/ToastContext";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) {
      showToast("Post cannot be empty", "error");
      return;
    }
    setLoading(true);
    try {
      await apiClient.post("/post", { text: content }, token);
      setContent("");
      showToast("Post created!");
      onPostCreated();
    } catch (err) {
      showToast("Failed to create post", "error");
      console.error("Create post error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex gap-3">
        <div className="w-11 h-11 bg-[#0a66c2] rounded-full flex items-center justify-center text-white font-semibold">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start a post"
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a66c2] resize-none"
          />

          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-3 text-sm text-gray-600">
              <button className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-100 transition">
                <span className="text-green-500">●</span>
                <span>Photo</span>
              </button>
              <button className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-100 transition">
                <span className="text-red-400">●</span>
                <span>Video</span>
              </button>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
                className="px-4 py-2 bg-[#0a66c2] text-white rounded-full hover:bg-[#004182] disabled:opacity-60 transition text-sm"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
