"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, X } from "lucide-react"

const UpdatePost = () => {
  const { user, token, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { postId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  })

  // Sample data for demonstration - in a real app, you would fetch this from an API
  const samplePosts = [
    {
      id: 1,
      title: "How I Built a Responsive Portfolio in a Weekend",
      content:
        "I decided to challenge myself and build a complete portfolio website in just one weekend. Here's how I did it using React, Tailwind CSS, and a bit of creativity. The key was to start with a clear design in mind and use component libraries to speed up development...",
      category: "Coding",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "5 Watercolor Techniques Every Beginner Should Know",
      content:
        "Watercolor painting can be intimidating for beginners, but these five essential techniques will help you create beautiful artwork from day one. I'll cover wet-on-wet, dry brush, layering, salt texturing, and lifting techniques with examples of each...",
      category: "Art",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "My Journey Learning JavaScript: Tips for Beginners",
      content:
        "When I first started learning JavaScript, I was overwhelmed by the amount of information available. In this post, I share my learning journey and provide practical tips for beginners who want to master JavaScript efficiently without getting lost in the sea of resources...",
      category: "Coding",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login")
      return
    }

    // In a real app, you would fetch the post data from an API
    // For now, we'll use the sample data
    const post = samplePosts.find((p) => p.id === Number.parseInt(postId))

    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
      })
      setMediaPreview(post.image)
    } else {
      // Post not found, redirect to my posts
      navigate("/my-posts")
    }

    setIsLoading(false)
  }, [postId, isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeMedia = () => {
    setMediaPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Here you would normally send the data to your API
    // For now, we'll just simulate a successful submission
    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/my-posts")
      // You could also show a success message here
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading post...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Update Post</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Give your post a title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Share your knowledge, tips, or experience..."
                value={formData.content}
                onChange={handleChange}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={handleSelectChange} value={formData.category} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Coding">Coding</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Art">Art & Design</SelectItem>
                  <SelectItem value="DIY">DIY & Crafts</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Languages">Languages</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Media</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {mediaPreview ? (
                  <div className="relative">
                    <img
                      src={mediaPreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeMedia}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Camera className="h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500">Upload an image or video</p>
                      <p className="text-xs text-gray-400">Supports: JPG, PNG, GIF, MP4 (max 20MB)</p>
                      <Label
                        htmlFor="media-upload"
                        className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </Label>
                      <input
                        id="media-upload"
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleMediaChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2 mt-5 w-full pr-2">
              <Button type="button" variant="outline" className="w-1/2" onClick={() => navigate("/my-posts")}>
                Cancel
              </Button>
              <Button type="submit" className="w-1/2" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Post"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default UpdatePost
