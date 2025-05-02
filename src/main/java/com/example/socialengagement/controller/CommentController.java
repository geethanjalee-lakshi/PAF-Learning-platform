package com.example.socialengagement.controller;

import com.example.socialengagement.model.Comment;
import com.example.socialengagement.service.CommentService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // Mock current user id and role, replace with real auth in production
    private final Long currentUserId = 1L;
    private final boolean isAdmin = false;

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        // Validate content
        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment content is required");
        }

        // Validate post ID
        if (comment.getPost() == null || comment.getPost().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required");
        }

        // Validate author ID
        if (comment.getAuthor() == null || comment.getAuthor().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Author ID is required");
        }

        Comment savedComment = commentService.createComment(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        return ResponseEntity.ok(commentService.getAllComments());
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long commentId, @RequestBody Comment comment) {
        return ResponseEntity.ok(commentService.updateComment(commentId, comment, currentUserId));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId, currentUserId, isAdmin);
        return ResponseEntity.ok("Comment deleted successfully");
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<Comment> toggleLike(@PathVariable Long commentId) {
        return ResponseEntity.ok(commentService.toggleLike(commentId, currentUserId));
    }

}
