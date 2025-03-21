
package com.biblios.controller;

import com.biblios.dto.BookDto;
import com.biblios.model.User;
import com.biblios.service.BookService;
import com.biblios.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<BookDto>> getAllBooks(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.getCurrentUser(userDetails);
        return ResponseEntity.ok(bookService.getAllBooks(currentUser));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<BookDto>> searchBooks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String query) {
        User currentUser = userService.getCurrentUser(userDetails);
        return ResponseEntity.ok(bookService.searchBooks(currentUser, query));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.getCurrentUser(userDetails);
        return ResponseEntity.ok(bookService.getBookById(id, currentUser));
    }
    
    @PostMapping
    public ResponseEntity<BookDto> createBook(
            @Valid @RequestBody BookDto bookDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.getCurrentUser(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookService.createBook(bookDto, currentUser));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BookDto> updateBook(
            @PathVariable String id,
            @Valid @RequestBody BookDto bookDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.getCurrentUser(userDetails);
        return ResponseEntity.ok(bookService.updateBook(id, bookDto, currentUser));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.getCurrentUser(userDetails);
        bookService.deleteBook(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
