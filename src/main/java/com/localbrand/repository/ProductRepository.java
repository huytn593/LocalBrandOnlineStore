package com.localbrand.repository;

import com.localbrand.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    @Query(value = "{ $text: { $search: ?0 } }")
    Page<Product> findByTextSearch(String search, Pageable pageable);

    @Query(value = "{ 'categoryId': ?0 }")
    Page<Product> findByCategory(String categoryId, Pageable pageable);
    
    @Query(value = "{ $text: { $search: ?0 }, 'categoryId': ?1 }")
    Page<Product> findByTextSearchAndCategory(String search, String categoryId, Pageable pageable);

    // Advanced filtering can also be done using MongoTemplate if needed, 
    // but we can start with basic derived queries for min/max prices without text search
    Page<Product> findByPriceBetween(double minPrice, double maxPrice, Pageable pageable);
    Page<Product> findByCategoryIdAndPriceBetween(String categoryId, double minPrice, double maxPrice, Pageable pageable);
}
