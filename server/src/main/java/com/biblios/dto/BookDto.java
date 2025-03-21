
package com.biblios.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookDto {
    
    private String id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    private String coverImage;
    
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;
    
    private String isbn;
    
    @NotNull(message = "Published year is required")
    private Integer publishedYear;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private Double rating;
    
    private String createdAt;
    private String updatedAt;
}
