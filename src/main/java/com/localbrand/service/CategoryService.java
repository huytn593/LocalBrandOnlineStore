package com.localbrand.service;

import com.localbrand.dto.CategoryRequest;
import com.localbrand.exception.ResourceNotFoundException;
import com.localbrand.model.Category;
import com.localbrand.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    public Category createCategory(CategoryRequest categoryRequest) {
        Category category = Category.builder()
                .name(categoryRequest.getName())
                .description(categoryRequest.getDescription())
                .createdAt(LocalDateTime.now())
                .build();
        return categoryRepository.save(category);
    }

    public Category updateCategory(String id, CategoryRequest categoryRequest) {
        Category existingCategory = getCategoryById(id);
        existingCategory.setName(categoryRequest.getName());
        existingCategory.setDescription(categoryRequest.getDescription());
        return categoryRepository.save(existingCategory);
    }

    public void deleteCategory(String id) {
        Category existingCategory = getCategoryById(id);
        categoryRepository.delete(existingCategory);
    }
}
