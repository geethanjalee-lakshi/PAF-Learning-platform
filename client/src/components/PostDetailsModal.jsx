"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageSquare, Share2, Edit, Trash2, MoreVertical } from "lucide-react"
import { useAuth } from "../context/AuthContext"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const PostDetailsModal = ({ post, isOpen, onClose, onLike, onAddComment }) => {
  const { user } = useAuth()
  const [comment, setComment] = useState("")
  const [hasLiked, setHasLiked] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [commentLikes, setCommentLikes] = useState({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const editCommentRef = useRef(null)

  const handleLike = () => {
    if (!hasLiked) {
      onLike(post.id)
      setHasLiked(true)
    }
  }

  const handleAddComment = () => {
    if (comment.trim()) {
      onAddComment(post.id, comment)
      setComment("")
    }
  }

  const handleEditComment = (commentId, commentText) => {
    setEditingCommentId(commentId)
    setEditCommentText(commentText)
    // Focus the textarea after it renders
    setTimeout(() => {
      if (editCommentRef.current) {
        editCommentRef.current.focus()
      }
    }, 0)
  }

  const handleSaveComment = (commentId) => {
    if (editCommentText.trim()) {
      // In a real app, you would call an API to update the comment
      post.comments = post.comments.map((c) => {
        if (c.id === commentId) {
          return { ...c, content: editCommentText, edited: true }
        }
        return c
      })
      setEditingCommentId(null)
      setEditCommentText("")
    }
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditCommentText("")
  }

  const handleDeleteCommentClick = (commentId) => {
    setCommentToDelete(commentId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteComment = () => {
    // In a real app, you would call an API to delete the comment
    post.comments = post.comments.filter((c) => c.id !== commentToDelete)
    setIsDeleteDialogOpen(false)
    setCommentToDelete(null)
  }

  const handleLikeComment = (commentId) => {
    setCommentLikes((prev) => {
      const currentLikes = prev[commentId] || 0
      const isLiked = currentLikes < 0 // Using negative numbers to track liked state

      if (isLiked) {
        // Unlike: remove the like and set to positive count
        return { ...prev, [commentId]: Math.abs(currentLikes) }
      } else {
        // Like: set to negative to indicate user has liked it
        return { ...prev, [commentId]: -(currentLikes + 1) }
      }
    })
  }

  const isCommentLiked = (commentId) => {
    return (commentLikes[commentId] || 0) < 0
  }

  const getCommentLikeCount = (commentId) => {
    const count = commentLikes[commentId] || 0
    return Math.abs(count)
  }

  const isCurrentUserComment = (commentAuthor) => {
    // In a real app, you would compare with the actual user ID or username
    return commentAuthor === "You" || commentAuthor === user?.username
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{post.title}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{post.author}</span>
            <span className="text-xs text-gray-500">• {post.timeAgo}</span>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge>{post.category}</Badge>
          </div>

          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full rounded-md object-cover max-h-80"
          />

          <div className="text-sm text-gray-700 whitespace-pre-line">{post.content}</div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${hasLiked ? "text-red-500" : ""}`}
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 ${hasLiked ? "fill-red-500" : ""}`} />
                <span>{post.likes + (hasLiked ? 1 : 0)}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageSquare className="h-5 w-5" />
                <span>{post.comments.length}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Comments</h3>

            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="resize-none"
                />
                <Button size="sm" onClick={handleAddComment} disabled={!comment.trim()}>
                  Post
                </Button>
              </div>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto">
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          {comment.edited && <span className="text-xs text-gray-500">(edited)</span>}
                        </div>
                        {isCurrentUserComment(comment.author) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditComment(comment.id, comment.content)}
                                className="flex items-center"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteCommentClick(comment.id)}
                                className="flex items-center text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      {editingCommentId === comment.id ? (
                        <div className="mt-2 space-y-2">
                          <Textarea
                            ref={editCommentRef}
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="resize-none text-sm"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSaveComment(comment.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm mt-1">{comment.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-6 px-2 flex items-center gap-1 ${
                                isCommentLiked(comment.id) ? "text-red-500" : "text-gray-500"
                              }`}
                              onClick={() => handleLikeComment(comment.id)}
                            >
                              <Heart className={`h-3.5 w-3.5 ${isCommentLiked(comment.id) ? "fill-red-500" : ""}`} />
                              <span className="text-xs">
                                {getCommentLikeCount(comment.id) > 0 ? getCommentLikeCount(comment.id) : "Like"}
                              </span>
                            </Button>
                            <span className="text-xs text-gray-500">Reply</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteComment} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}

export default PostDetailsModal

