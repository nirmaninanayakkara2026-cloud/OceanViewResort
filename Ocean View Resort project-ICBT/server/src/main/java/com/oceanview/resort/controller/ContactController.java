package com.oceanview.resort.controller;

import com.oceanview.resort.dto.ApiResponse;
import com.oceanview.resort.model.Contact;
import com.oceanview.resort.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ContactController {
    
    private final ContactService contactService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> createContact(@RequestBody Contact contact) {
        try {
            Contact created = contactService.createContact(contact);
            return ResponseEntity.ok(new ApiResponse(true, "Message sent successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(contactService.getContactById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Contact>> getContactsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(contactService.getContactsByStatus(status));
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<List<Contact>> getContactsByEmail(@PathVariable String email) {
        return ResponseEntity.ok(contactService.getContactsByEmail(email));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateContactStatus(
        @PathVariable String id,
        @RequestParam String status
    ) {
        try {
            Contact updated = contactService.updateContactStatus(id, status);
            return ResponseEntity.ok(new ApiResponse(true, "Contact status updated successfully", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteContact(@PathVariable String id) {
        try {
            contactService.deleteContact(id);
            return ResponseEntity.ok(new ApiResponse(true, "Contact deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
