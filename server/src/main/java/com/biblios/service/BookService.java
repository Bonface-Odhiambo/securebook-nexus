
package com.biblios.service;

import com.biblios.dto.BookDto;
import com.biblios.model.Book;
import com.biblios.model.User;
import com.biblios.repository.BookRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final UserService userService;
    
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    public List<BookDto> getAllBooks(User currentUser) {
        return bookRepository.findByUserOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public List<BookDto> searchBooks(User currentUser, String searchTerm) {
        return bookRepository.findByUserAndTitleContainingIgnoreCaseOrUserAndAuthorContainingIgnoreCase(
                        currentUser, searchTerm, currentUser, searchTerm)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public BookDto getBookById(String id, User currentUser) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + id));
        
        if (!book.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You don't have access to this book");
        }
        
        return mapToDto(book);
    }
    
    public BookDto createBook(BookDto bookDto, User currentUser) {
        Book book = Book.builder()
                .title(bookDto.getTitle())
                .author(bookDto.getAuthor())
                .coverImage(bookDto.getCoverImage())
                .description(bookDto.getDescription())
                .isbn(bookDto.getIsbn())
                .publishedYear(bookDto.getPublishedYear())
                .category(bookDto.getCategory())
                .rating(bookDto.getRating())
                .user(currentUser)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Book savedBook = bookRepository.save(book);
        
        return mapToDto(savedBook);
    }
    
    public BookDto updateBook(String id, BookDto bookDto, User currentUser) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + id));
        
        if (!existingBook.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You don't have access to update this book");
        }
        
        existingBook.setTitle(bookDto.getTitle());
        existingBook.setAuthor(bookDto.getAuthor());
        existingBook.setCoverImage(bookDto.getCoverImage());
        existingBook.setDescription(bookDto.getDescription());
        existingBook.setIsbn(bookDto.getIsbn());
        existingBook.setPublishedYear(bookDto.getPublishedYear());
        existingBook.setCategory(bookDto.getCategory());
        existingBook.setRating(bookDto.getRating());
        existingBook.setUpdatedAt(LocalDateTime.now());
        
        Book updatedBook = bookRepository.save(existingBook);
        
        return mapToDto(updatedBook);
    }
    
    public void deleteBook(String id, User currentUser) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + id));
        
        if (!book.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You don't have access to delete this book");
        }
        
        bookRepository.delete(book);
    }
    
    private BookDto mapToDto(Book book) {
        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .coverImage(book.getCoverImage())
                .description(book.getDescription())
                .isbn(book.getIsbn())
                .publishedYear(book.getPublishedYear())
                .category(book.getCategory())
                .rating(book.getRating())
                .createdAt(book.getCreatedAt().format(formatter))
                .updatedAt(book.getUpdatedAt().format(formatter))
                .build();
    }
}
