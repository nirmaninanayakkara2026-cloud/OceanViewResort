package com.oceanview.resort.service;

import com.oceanview.resort.model.Package;
import com.oceanview.resort.repository.PackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PackageService {
    
    private final PackageRepository packageRepository;
    
    public List<Package> getAllPackages() {
        return packageRepository.findByActiveTrue();
    }
    
    public Package getPackageById(String id) {
        return packageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Package not found"));
    }
    
    public Package getPackageByPackageId(String packageId) {
        return packageRepository.findByPackageId(packageId)
            .orElseThrow(() -> new RuntimeException("Package not found"));
    }
    
    public List<Package> getPopularPackages() {
        return packageRepository.findByPopularTrue();
    }
    
    public Package createPackage(Package pkg) {
        pkg.setActive(true);
        return packageRepository.save(pkg);
    }
    
    public Package updatePackage(String id, Package packageDetails) {
        Package pkg = getPackageById(id);
        
        pkg.setPackageId(packageDetails.getPackageId());
        pkg.setName(packageDetails.getName());
        pkg.setPrice(packageDetails.getPrice());
        pkg.setIcon(packageDetails.getIcon());
        pkg.setFeatures(packageDetails.getFeatures());
        pkg.setDescription(packageDetails.getDescription());
        pkg.setPopular(packageDetails.isPopular());
        
        return packageRepository.save(pkg);
    }
    
    public void deletePackage(String id) {
        Package pkg = getPackageById(id);
        pkg.setActive(false);
        packageRepository.save(pkg);
    }
}
