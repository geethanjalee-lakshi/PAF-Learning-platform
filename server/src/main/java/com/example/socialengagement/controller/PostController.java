package com.example.socialengagement.controller;

import com.example.socialengagement.model.Post;
import com.example.socialengagement.service.PostService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    // Mock current user id and role, replace with proper auth in real app
    private final Long currentUserId = 1L;
    private final boolean isAdmin = false;

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        // Validate author presence
        if (post.getAuthor() == null || post.getAuthor().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Author ID is required");
        }

        // Validate content presence
        if (post.getContent() == null || post.getContent().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post content is required");
        }

        Post createdPost = postService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PutMapping("/{postId}")
    public ResponseEntity<Post> updatePost(@PathVariable Long postId, @RequestBody Post post) {
        return ResponseEntity.ok(postService.updatePost(postId, post, currentUserId));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId, currentUserId, isAdmin);
        return ResponseEntity.ok("Post deleted successfully");
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Post> toggleLike(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.toggleLike(postId, currentUserId));
    }
}
