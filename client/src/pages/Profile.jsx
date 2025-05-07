"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const Profile = () => {
  const { user, token, isAuthenticated, loading, logout } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()

  // Sample dummy data to show when actual data isn't available
  const dummyData = {
    id: "123456",
    username: "visura",
    email: "visuradesilva@gmail.com",
    fullName: "visura de silva",
    role: "Student",
    status: "Active",
    avatar: "",
    bio: "I am a software developer with a passion for building beautiful and functional web applications.",
    phone: "0712345678",
    location: "Kiribathgoda, Sri Lanka",
    createdAt: "2023-06-15T00:00:00.000Z"
  }

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate("/login")
      return
    }

    const fetchUserProfile = async () => {
      if (!user?.id) return

      try {
        setIsLoading(true)
        const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile data")
        }

        const data = await response.json()
        setProfileData(data)
        setFormData(data)
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError(err.message || "Failed to load profile")
        // Use dummy data when real data fails to load
        setProfileData(dummyData)
        setFormData(dummyData)
      } finally {
        setIsLoading(false)
      }
    }

    // Short timeout to ensure we show some UI even if API is down
    const timer = setTimeout(() => {
      if (isLoading) {
        setProfileData(dummyData)
        setFormData(dummyData)
        setIsLoading(false)
      }
    }, 3000)

    if (user?.id) {
      fetchUserProfile()
    } else if (!loading) {
      // If user is not loading but we don't have an ID, use dummy data
      setProfileData(dummyData)
      setFormData(dummyData)
      setIsLoading(false)
    }

    return () => clearTimeout(timer)
  }, [user, token, isAuthenticated, loading, navigate, isLoading])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true)
      // If we're using dummy data, just update the state
      if (!user?.id || profileData === dummyData) {
        setProfileData(formData)
        setIsEditing(false)
        setIsLoading(false)
        return
      }

      // In a real app, this would be an API call
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedData = await response.json()
      setProfileData(updatedData)
      setIsEditing(false)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err.message || "Failed to update profile")
      // For demo purposes, update the state anyway
      setProfileData(formData)
      setIsEditing(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would be an API call
      if (user?.id && profileData !== dummyData) {
        await fetch(`http://localhost:8080/api/users/${user.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
      
      // Log the user out and redirect to home page
      logout()
      navigate("/")
    } catch (err) {
      console.error("Error deleting account:", err)
      setError(err.message || "Failed to delete account")
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <CardDescription>View and manage your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          {error && !isEditing && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {isEditing ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={formData?.avatar}
                    alt={formData?.username}
                  />
                  <AvatarFallback className="text-2xl">
                    {(formData?.username || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      name="username" 
                      value={formData?.username || ""} 
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData?.email || ""} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    value={formData?.fullName || ""} 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData?.phone || ""} 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData?.location || ""} 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input 
                    id="status" 
                    name="status" 
                    value={formData?.status || ""} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  rows={4}
                  value={formData?.bio || ""} 
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setFormData(profileData)
                  setIsEditing(false)
                  setError("")
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profileData?.avatar || user?.avatar}
                    alt={profileData?.username || user?.username}
                  />
                  <AvatarFallback className="text-2xl">
                    {(profileData?.username || user?.username || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-xl font-bold">{profileData?.username || user?.username}</h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <Badge variant="outline">{profileData?.role || user?.role || "User"}</Badge>
                    {profileData?.status && <Badge>{profileData.status}</Badge>}
                  </div>
                  <p className="text-gray-500">{profileData?.email || user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                  <p>{profileData?.fullName || "Not provided"}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
                  <p>
                    {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : "Not available"}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p>{profileData?.phone || "Not provided"}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-500">Location</h4>
                  <p>{profileData?.location || "Not provided"}</p>
                </div>
              </div>

              {profileData?.bio && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                  <p className="text-gray-700">{profileData.bio}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {!isEditing && (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default Profile
