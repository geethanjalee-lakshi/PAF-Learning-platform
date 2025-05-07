

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Code, ChefHat, Camera, Paintbrush, Lightbulb, TrendingUp, Users, Clock } from "lucide-react"
import { useState } from "react"
import PostDetailsModal from "../components/PostDetailsModal"

const Home = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate("/login")
    }
  }, [isAuthenticated, loading, navigate])

  // Sample data for the home page
  const featuredSkills = [
    {
      id: 1,
      title: "Introduction to Web Development",
      instructor: "Sarah Johnson",
      instructorAvatar: "/placeholder.svg",
      category: "Coding",
      icon: <Code className="h-5 w-5" />,
      students: 1243,
      level: "Beginner",
    },
    {
      id: 2,
      title: "Mastering Italian Cuisine",
      instructor: "Marco Rossi",
      instructorAvatar: "/placeholder.svg",
      category: "Cooking",
      icon: <ChefHat className="h-5 w-5" />,
      students: 856,
      level: "Intermediate",
    },
    {
      id: 3,
      title: "Portrait Photography Essentials",
      instructor: "Emma Chen",
      instructorAvatar: "/placeholder.svg",
      category: "Photography",
      icon: <Camera className="h-5 w-5" />,
      students: 972,
      level: "All Levels",
    },
  ]

  const [trendingPosts, setTrendingPosts] = useState([
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

  const skillCategories = [
    { name: "Coding", icon: <Code className="h-5 w-5" />, count: 1243 },
    { name: "Cooking", icon: <ChefHat className="h-5 w-5" />, count: 856 },
    { name: "Photography", icon: <Camera className="h-5 w-5" />, count: 972 },
    { name: "Art & Design", icon: <Paintbrush className="h-5 w-5" />, count: 1105 },
    { name: "DIY & Crafts", icon: <Lightbulb className="h-5 w-5" />, count: 734 },
  ]

  const handleOpenModal = (post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleLike = (postId) => {
    setTrendingPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return { ...post, likes: post.likes + 1 }
        }
        return post
      }),
    )
  }

  const handleAddComment = (postId, comment) => {
    setTrendingPosts((prevPosts) =>
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
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
          <div
            className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg')]"
            style={{ backgroundSize: "cover", backgroundPosition: "center" }}
          ></div>
          <div className="relative z-10 px-6 py-12 md:py-20 md:px-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Share Your Skills, Expand Your Horizons</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">
              Connect with passionate learners and skilled instructors. Showcase your expertise or master new skills in
              our supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-violet-800 hover:bg-gray-100">
                Explore Skills
              </Button>
              <Button size="lg" variant="outline" className="bg-violet-700 text-white">
                Share Your Knowledge
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="mb-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
          <input
            type="text"
            placeholder="Search for skills, topics, or instructors..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </section>

      {/* Welcome Message */}
      <section className="mb-10">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.username} />
                <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.username || "Learner"}!</h2>
                <p className="text-gray-600 mb-4">
                  Continue your learning journey or share your knowledge with our community.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    My Learning Path
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate("/create-post")}>
                    Create New Post
                  </Button>
                  <Button variant="outline" size="sm">
                    My Saved Skills
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Content Tabs */}
      <Tabs defaultValue="discover" className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="discover" className="text-base">
            <TrendingUp className="mr-2 h-4 w-4" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="following" className="text-base">
            <Users className="mr-2 h-4 w-4" />
            Following
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-base">
            <Clock className="mr-2 h-4 w-4" />
            Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-8">
          {/* Featured Skills */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Featured Skills</h2>
              <Button variant="ghost">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSkills.map((skill) => (
                <Card key={skill.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      {skill.icon}
                      <span className="ml-2 text-lg font-medium">{skill.category}</span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge variant="outline">{skill.level}</Badge>
                      <Badge>{skill.students} students</Badge>
                    </div>
                    <CardTitle className="mt-2">{skill.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={skill.instructorAvatar || "/placeholder.svg"} alt={skill.instructor} />
                        <AvatarFallback>{skill.instructor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">{skill.instructor}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Explore Skill</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Trending Posts */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Trending Posts</h2>
              <Button variant="ghost" onClick={() => navigate("/all-posts")}>
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPosts.map((post) => (
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
                    <CardTitle className="mt-2 text-lg">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">{post.author}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-gray-500">
                    <div>❤️ {post.likes} likes</div>
                    <div>💬 {post.comments.length} comments</div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="following">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Start following creators and topics</h3>
            <p className="text-gray-600 mb-6">
              Follow instructors and topics you're interested in to see their latest posts and updates here.
            </p>
            <Button>Discover People to Follow</Button>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No recent activity yet</h3>
            <p className="text-gray-600 mb-6">
              As you interact with skills and posts, your recent activity will appear here.
            </p>
            <Button>Explore Popular Content</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Skill Categories */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Explore Skill Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skillCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
                  {category.icon}
                </div>
                <h3 className="font-medium mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} skills</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="mb-10">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Ready to Share Your Expertise?</h2>
                <p className="max-w-md">
                  Create your first skill-sharing post and connect with learners from around the world.
                </p>
              </div>
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-gray-100"
                onClick={() => navigate("/create-post")}
              >
                Start Creating
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

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

export default Home


