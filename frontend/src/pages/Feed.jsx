import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/post", token);
      setPosts(data.data || []);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDEBAR — dynamic user info */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Banner section */}
            <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-400"></div>

            {/* Profile section */}
            <div className="p-4 -mt-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#0a66c2] rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900">
                {user?.name || "Unknown User"}
              </h3>
              <p className="text-xs text-gray-500">Software Developer</p>
            </div>

            {/* Stats */}
            <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-700 space-y-2">
              <div className="flex justify-between hover:bg-gray-50 py-1 px-2 rounded transition">
                <span className="text-gray-600">Profile views</span>
                <span className="font-semibold text-[#0a66c2]">12</span>
              </div>
              <div className="flex justify-between hover:bg-gray-50 py-1 px-2 rounded transition">
                <span className="text-gray-600">Post impressions</span>
                <span className="font-semibold text-[#0a66c2]">3</span>
              </div>
            </div>

            {/* Footer link */}
            <div className="border-t border-gray-200 px-4 py-3 text-xs text-[#0a66c2] font-medium hover:underline cursor-pointer">
              My Network
            </div>
          </div>
        </aside>

        {/* CENTER FEED */}
        <main className="lg:col-span-6">
          <CreatePost onPostCreated={loadPosts} />

          {loading ? (
            <Loader />
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onUpdate={loadPosts} />
              ))}

              {posts.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-lg">No posts yet. Be the first to share something!</p>
                </div>
              )}
            </>
          )}
        </main>

        {/* RIGHT SIDEBAR — LinkedIn-style widgets */}
        <aside className="lg:col-span-3 hidden lg:block space-y-4">
          {/* News Widget */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">News</h4>
            <ul className="text-sm text-gray-700 space-y-3">
              <li>
                <div className="font-medium">Tech layoffs continue</div>
                <div className="text-xs text-gray-500">2h • 14,176 readers</div>
              </li>
              <li>
                <div className="font-medium">Top startups in 5 cities</div>
                <div className="text-xs text-gray-500">3d • 8,015 readers</div>
              </li>
              <li>
                <button className="text-[#0a66c2] text-sm font-medium mt-2 hover:underline">
                  Show more
                </button>
              </li>
            </ul>
          </div>

          {/* Puzzle Widget */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Today's Puzzles</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded transition">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">🎯</div>
                <div>
                  <div className="font-medium">Mini Sudoku</div>
                  <div className="text-xs text-gray-500">Solve in 60s</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Feed;
