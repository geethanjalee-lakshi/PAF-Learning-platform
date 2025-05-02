package com.example.socialengagement.controller;

import com.example.socialengagement.model.User;
import com.example.socialengagement.service.UserDetailsServiceImpl;
import com.example.socialengagement.service.UserService;
import com.example.socialengagement.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Create User
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // Get all Users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get a User by ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Update a User
    // @PutMapping("/{id}")
    // public User updateUser(@PathVariable Long id, @RequestBody User userDetails)
    // {
    // return userService.updateUser(id, userDetails);
    // }

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedDetails) {
        // Get the existing user before updating
        User existingUser = userService.getUserById(id);
        String oldUsername = existingUser.getUsername();

        // Perform the update
        User updatedUser = userService.updateUser(id, updatedDetails);

        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User updated successfully");
        response.put("user", updatedUser);

        // Check if the username has changed
        if (!oldUsername.equals(updatedUser.getUsername())) {
            // Reload user details using the updated username
            UserDetails userDetails = userDetailsService.loadUserByUsername(updatedUser.getUsername());

            // Extract role from authorities
            String role = userDetails.getAuthorities().iterator().next().getAuthority();

            // Generate new token
            String newToken = jwtUtil.generateToken(updatedUser.getUsername(), role);
            response.put("token", newToken);
        }

        return ResponseEntity.ok(response);
    }

    // Delete a User
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

}
