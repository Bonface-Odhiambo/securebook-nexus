
package com.biblios.repository;

import com.biblios.model.Book;
import com.biblios.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {
    
    List<Book> findByUser(User user);
    
    List<Book> findByUserOrderByCreatedAtDesc(User user);
    
    List<Book> findByUserAndTitleContainingIgnoreCaseOrUserAndAuthorContainingIgnoreCase(
            User user, String title, User sameUser, String author);
}
