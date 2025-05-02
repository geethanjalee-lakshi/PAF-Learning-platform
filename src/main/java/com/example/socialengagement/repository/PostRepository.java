package com.example.socialengagement.repository;

import com.example.socialengagement.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
