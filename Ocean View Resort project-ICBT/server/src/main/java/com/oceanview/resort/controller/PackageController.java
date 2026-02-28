package com.oceanview.resort.controller;

import com.oceanview.resort.dto.ApiResponse;
import com.oceanview.resort.model.Package;
import com.oceanview.resort.service.PackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class PackageController {
    
    private final PackageService packageService;
    
    @GetMapping
    public ResponseEntity<List<Package>> getAllPackages() {
        return ResponseEntity.ok(packageService.getAllPackages());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Package> getPackageById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(packageService.getPackageById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/package/{packageId}")
    public ResponseEntity<Package> getPackageByPackageId(@PathVariable String packageId) {
        try {
            return ResponseEntity.ok(packageService.getPackageByPackageId(packageId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/popular")
    public ResponseEntity<List<Package>> getPopularPackages() {
        return ResponseEntity.ok(packageService.getPopularPackages());
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse> createPackage(@RequestBody Package pkg) {
        try {
            Package createdPackage = packageService.createPackage(pkg);
            return ResponseEntity.ok(new ApiResponse(true, "Package created successfully", createdPackage));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updatePackage(
        @PathVariable String id,
        @RequestBody Package pkg
    ) {
        try {
            Package updatedPackage = packageService.updatePackage(id, pkg);
            return ResponseEntity.ok(new ApiResponse(true, "Package updated successfully", updatedPackage));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deletePackage(@PathVariable String id) {
        try {
            packageService.deletePackage(id);
            return ResponseEntity.ok(new ApiResponse(true, "Package deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
