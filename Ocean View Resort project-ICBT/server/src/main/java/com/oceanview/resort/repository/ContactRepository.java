package com.oceanview.resort.repository;

import com.oceanview.resort.model.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends MongoRepository<Contact, String> {
    
    List<Contact> findByStatus(String status);
    
    List<Contact> findByEmail(String email);
}
