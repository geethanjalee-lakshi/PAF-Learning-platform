"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, TrendingUp, Clock } from "lucide-react"
import PostDetailsModal from "../components/PostDetailsModal"

const AllPosts = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sample data for posts
  const [posts, setPosts] = useState([
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
    {
      id: 4,
      title: "Building Muscle: A Beginner's Guide to Strength Training",
      author: "Alex Fitness",
      authorAvatar: "/placeholder.svg",
      category: "Fitness",
      likes: 198,
      comments: [],
      timeAgo: "3 days ago",
      image: "/placeholder.svg?height=200&width=400",
      content:
        "Starting a strength training journey can be overwhelming. In this comprehensive guide, I break down the fundamentals of building muscle, including proper form, progressive overload, nutrition basics, and a sample 4-week program for beginners...",
    },
    {
      id: 5,
      title: "How to Shoot Stunning Night Photography with Any Camera",
      author: "Elena Chen",
      authorAvatar: "/placeholder.svg",
      category: "Photography",
      likes: 356,
      comments: [
        { id: 1, author: "Carlos", content: "What tripod do you recommend?", timestamp: "2 days ago" },
        {
          id: 2,
          author: "Elena",
          content: "I use a Manfrotto BeFree - lightweight but sturdy!",
          timestamp: "2 days ago",
        },
      ],
      timeAgo: "2 days ago",
      image: "/post4.jpg",
      content:
        "Night photography doesn't require expensive gear! In this guide, I'll show you how to capture stunning night scenes using any camera. We'll cover long exposure techniques, finding the right composition in low light, essential accessories, and post-processing tips to make your night photos shine...",
    },
    {
      id: 6,
      title: "Learn to Play Guitar: First 5 Songs Every Beginner Should Master",
      author: "David Strings",
      authorAvatar: "/placeholder.svg",
      category: "Music",
      likes: 275,
      comments: [],
      timeAgo: "4 days ago",
      image: "/placeholder.svg?height=200&width=400",
      content:
        "Starting your guitar journey with the right songs can make all the difference in staying motivated. I've selected five beginner-friendly songs that sound impressive but only require basic chords and techniques. Each song introduces a new skill while being recognizable and fun to play...",
    },
  ])

  const handleOpenModal = (post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return { ...post, likes: post.likes + 1 }
        }
        return post
      }),
    )
  }

  const handleAddComment = (postId, comment) => {
    setPosts((prevPosts) =>
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

  const filteredPosts = posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Explore Posts</h1>
          <p className="text-gray-600">Discover and learn from our community's shared knowledge</p>
        </div>
        <Button onClick={() => navigate("/create-post")}>Create New Post</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search posts by title, author, or content..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="trending" className="mb-8">
        <TabsList>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts
              .sort((a, b) => b.likes - a.likes)
              .map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleOpenModal(post)}
                >
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge>{post.category}</Badge>
                      <span className="text-xs text-gray-500">{post.timeAgo}</span>
                    </div>
                    <CardTitle className="mt-2 text-lg line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-3">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">{post.author}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-3 text-sm">{post.content}</p>
                    <div className="flex justify-between text-sm text-gray-500 mt-4">
                      <div>❤️ {post.likes} likes</div>
                      <div>💬 {post.comments.length} comments</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts
              .sort((a, b) => new Date(b.timeAgo) - new Date(a.timeAgo))
              .map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleOpenModal(post)}
                >
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge>{post.category}</Badge>
                      <span className="text-xs text-gray-500">{post.timeAgo}</span>
                    </div>
                    <CardTitle className="mt-2 text-lg line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-3">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">{post.author}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-3 text-sm">{post.content}</p>
                    <div className="flex justify-between text-sm text-gray-500 mt-4">
                      <div>❤️ {post.likes} likes</div>
                      <div>💬 {post.comments.length} comments</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedPost && (
        <PostDetailsModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onLike={handleLike}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  )
}

export default AllPosts
