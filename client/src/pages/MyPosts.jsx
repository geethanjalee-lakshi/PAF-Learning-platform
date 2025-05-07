"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Plus, Filter } from "lucide-react"
import PostDetailsModal from "../components/PostDetailsModal"

const MyPosts = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)

  // Sample data for user's posts
  const [userPosts, setUserPosts] = useState([
    {
      id: 1,
      title: "How I Built a Responsive Portfolio in a Weekend",
      author: "Jason Lee",
      authorAvatar: "/placeholder.svg",
      category: "Coding",
      likes: 342,
      comments: [
        { id: 1, author: "Sarah", content: "This is so helpful! Thanks for sharing.", timestamp: "2 hours ago" },
        { id: 2, author: "Mike", content: "I'm going to try this approach this weekend.", timestamp: "1 hour ago" },
      ],
      timeAgo: "2 hours ago",
      image: "/post1.png",
      content:
        "I decided to challenge myself and build a complete portfolio website in just one weekend. Here's how I did it using React, Tailwind CSS, and a bit of creativity. The key was to start with a clear design in mind and use component libraries to speed up development...",
    },
    {
      id: 2,
      title: "5 Watercolor Techniques Every Beginner Should Know",
      author: "Mia Williams",
      authorAvatar: "/placeholder.svg",
      category: "Art",
      likes: 287,
      comments: [
        {
          id: 1,
          author: "Alex",
          content: "The wet-on-wet technique changed my painting game!",
          timestamp: "3 hours ago",
        },
      ],
      timeAgo: "5 hours ago",
      image: "/post2.jpg",
      content:
        "Watercolor painting can be intimidating for beginners, but these five essential techniques will help you create beautiful artwork from day one. I'll cover wet-on-wet, dry brush, layering, salt texturing, and lifting techniques with examples of each...",
    },
    {
      id: 3,
      title: "Creating the Perfect Sourdough Bread at Home",
      author: "Thomas Baker",
      authorAvatar: "/placeholder.svg",
      category: "Cooking",
      likes: 421,
      comments: [
        {
          id: 1,
          author: "Emma",
          content: "My starter never seems to be active enough. Any tips?",
          timestamp: "1 day ago",
        },
        {
          id: 2,
          author: "Thomas",
          content: "Make sure you're feeding it regularly and keeping it at room temperature!",
          timestamp: "1 day ago",
        },
        { id: 3, author: "Julia", content: "This recipe worked perfectly for me!", timestamp: "12 hours ago" },
      ],
      timeAgo: "1 day ago",
      image: "/post3.jpg",
      content:
        "After months of practice, I've perfected my sourdough bread recipe and process. In this post, I'll share my step-by-step method for creating a crusty, airy loaf with that distinctive sourdough flavor. The secret is in maintaining a healthy starter and mastering the folding technique...",
    },
  ])

  const handleOpenModal = (post, event) => {
    // Prevent opening the modal when clicking edit or delete buttons
    if (event && (event.target.closest(".edit-button") || event.target.closest(".delete-button"))) {
      return
    }
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleEditPost = (postId) => {
    navigate(`/update-post/${postId}`)
  }

  const handleDeleteClick = (post, event) => {
    event.stopPropagation()
    setPostToDelete(post)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // In a real app, you would call an API to delete the post
    setUserPosts(userPosts.filter((post) => post.id !== postToDelete.id))
    setIsDeleteDialogOpen(false)
    setPostToDelete(null)
  }

  const handleLike = (postId) => {
    setUserPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return { ...post, likes: post.likes + 1 }
        }
        return post
      }),
    )
  }

  const handleAddComment = (postId, comment) => {
    setUserPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: post.comments.length + 1,
            author: "You", // In a real app, this would be the current user's name
            content: comment,
            timestamp: "Just now",
          }
          return {
            ...post,
            comments: [...post.comments, newComment],
          }
        }
        return post
      }),
    )
  }

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate("/login")
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Posts</h1>
          <p className="text-gray-600">Manage and view all your created posts</p>
        </div>
        <Button onClick={() => navigate("/create-post")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Post
        </Button>
      </div>

      {userPosts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">You haven't created any posts yet</h3>
          <p className="text-gray-600 mb-6">
            Share your knowledge and expertise with the community by creating your first post.
          </p>
          <Button onClick={() => navigate("/create-post")}>Create Your First Post</Button>
        </div>
      ) : (
        <Tabs defaultValue="all" className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
                  onClick={(e) => handleOpenModal(post, e)}
                >
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 edit-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditPost(post.id)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 delete-button"
                      onClick={(e) => handleDeleteClick(post, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge>{post.category}</Badge>
                      <span className="text-xs text-gray-500">{post.timeAgo}</span>
                    </div>
                    <CardTitle className="mt-2 text-lg line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-gray-600 line-clamp-3 text-sm">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-gray-500">
                    <div>❤️ {post.likes} likes</div>
                    <div>💬 {post.comments.length} comments</div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="published" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
                  onClick={(e) => handleOpenModal(post, e)}
                >
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 edit-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditPost(post.id)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 delete-button"
                      onClick={(e) => handleDeleteClick(post, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge>{post.category}</Badge>
                      <span className="text-xs text-gray-500">{post.timeAgo}</span>
                    </div>
                    <CardTitle className="mt-2 text-lg line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-gray-600 line-clamp-3 text-sm">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-gray-500">
                    <div>❤️ {post.likes} likes</div>
                    <div>💬 {post.comments.length} comments</div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="mt-6">
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No drafts found</h3>
              <p className="text-gray-600 mb-6">
                You don't have any draft posts. Drafts will appear here when you save posts without publishing.
              </p>
              <Button variant="outline" onClick={() => navigate("/create-post")}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Draft
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {selectedPost && (
        <PostDetailsModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onLike={handleLike}
          onAddComment={handleAddComment}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default MyPosts
