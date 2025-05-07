package com.example.socialengagement.service;

import com.example.socialengagement.model.Post;
import com.example.socialengagement.model.User;
import com.example.socialengagement.repository.PostRepository;
import com.example.socialengagement.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    // private final UserRepository userRepository;
    @Autowired
    private UserRepository userRepository;

    // Create Post
    public Post createPost(Post post) {

        // Fetch author from DB
        Long authorId = post.getAuthor().getId();
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Author not found with id: " + authorId));

        post.setAuthor(author);
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPost(Long id) {
        return postRepository.findById(id);
    }

    public Post updatePost(Long postId, Post updatedPost, Long currentUserId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getAuthor().getId().equals(currentUserId)) {
            throw new RuntimeException("You can only update your own posts");
        }
        post.setContent(updatedPost.getContent());
        return postRepository.save(post);
    }

    public void deletePost(Long postId, Long currentUserId, boolean isAdmin) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getAuthor().getId().equals(currentUserId) && !isAdmin) {
            throw new RuntimeException("You can only delete your own posts");
        }
        postRepository.delete(post);
    }

    public Post toggleLike(Long postId, Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        if (post.getLikedUserIds().contains(userId)) {
            post.getLikedUserIds().remove(userId);
        } else {
            post.getLikedUserIds().add(userId);
        }
        return postRepository.save(post);
    }
}
