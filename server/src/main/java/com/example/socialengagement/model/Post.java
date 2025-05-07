package com.example.socialengagement.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@NoArgsConstructor
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ElementCollection
    private List<String> mediaUrls = new ArrayList<>();

    @ElementCollection
    private List<String> hashtags = new ArrayList<>();

    @ManyToOne
    @JsonIgnoreProperties({ "posts", "comments", "password" }) // ignore fields that cause recursion
    private User author;

    @Version
    private Long version;

    // @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval =
    // true)
    // private Set<Comment> comments = new HashSet<>();
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Comment> comments = new ArrayList<>();

    @ElementCollection
    private Set<Long> likedUserIds = new HashSet<>();
}
