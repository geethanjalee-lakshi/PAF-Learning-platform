"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, X } from "lucide-react"

const CreatePost = () => {
  const { user, token, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  })
  const [mediaPreview, setMediaPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      navigate("/home")
      // You could also show a success message here
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Post</CardTitle>
            <p className="text-sm text-gray-500">Share your knowledge, tips, or experience with the community.</p>
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
              <Select onValueChange={handleSelectChange} required>
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
              <Label>Add Media</Label>
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
            <div className="flex gap-2 w-full mt-5">
              <Button type="button" variant="outline" className="w-1/2" onClick={() => navigate("/home")}>
                Cancel
              </Button>
              <Button type="submit" className="w-1/2" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default CreatePost
