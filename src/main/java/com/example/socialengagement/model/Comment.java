package com.example.socialengagement.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@NoArgsConstructor
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    @JsonIgnoreProperties({ "posts", "comments", "password" })
    private User author;

    @ManyToOne
    @JsonBackReference
    private Post post;

    @ElementCollection
    private Set<Long> likedUserIds = new HashSet<>();
}
