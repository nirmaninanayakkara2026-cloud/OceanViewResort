package com.oceanview.resort.service;

import com.oceanview.resort.model.Contact;
import com.oceanview.resort.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {
    
    private final ContactRepository contactRepository;
    
    public Contact createContact(Contact contact) {
        contact.setStatus("new");
        contact.setSubmittedAt(LocalDateTime.now());
        return contactRepository.save(contact);
    }
    
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }
    
    public Contact getContactById(String id) {
        return contactRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contact not found"));
    }
    
    public List<Contact> getContactsByStatus(String status) {
        return contactRepository.findByStatus(status);
    }
    
    public List<Contact> getContactsByEmail(String email) {
        return contactRepository.findByEmail(email);
    }
    
    public Contact updateContactStatus(String id, String status) {
        Contact contact = getContactById(id);
        contact.setStatus(status);
        
        if (status.equals("replied")) {
            contact.setRespondedAt(LocalDateTime.now());
        }
        
        return contactRepository.save(contact);
    }
    
    public void deleteContact(String id) {
        contactRepository.deleteById(id);
    }
}
