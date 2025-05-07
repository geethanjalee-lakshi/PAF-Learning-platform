package com.example.socialengagement.service;

import com.example.socialengagement.model.Comment;
import com.example.socialengagement.model.Post;
import com.example.socialengagement.model.User;
import com.example.socialengagement.repository.CommentRepository;
import com.example.socialengagement.repository.PostRepository;
import com.example.socialengagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Comment createComment(Comment comment) {
        User user = userRepository.findById(comment.getAuthor().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(comment.getPost().getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        comment.setAuthor(user);
        comment.setPost(post);

        return commentRepository.save(comment);
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Optional<Comment> getComment(Long id) {
        return commentRepository.findById(id);
    }

    public Comment updateComment(Long commentId, Comment updatedComment, Long currentUserId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getAuthor().getId().equals(currentUserId)) {
            throw new RuntimeException("You can only update your own comments");
        }
        comment.setContent(updatedComment.getContent());
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, Long currentUserId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getAuthor().getId().equals(currentUserId) && !isAdmin) {
            throw new RuntimeException("You can only delete your own comments");
        }
        commentRepository.delete(comment);
    }

    public Comment toggleLike(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (comment.getLikedUserIds().contains(userId)) {
            comment.getLikedUserIds().remove(userId);
        } else {
            comment.getLikedUserIds().add(userId);
        }
        return commentRepository.save(comment);
    }
}
