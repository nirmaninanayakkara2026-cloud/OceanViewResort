package com.oceanview.resort.repository;

import com.oceanview.resort.model.Package;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PackageRepository extends MongoRepository<Package, String> {
    
    List<Package> findByActiveTrue();
    
    Optional<Package> findByPackageId(String packageId);
    
    List<Package> findByPopularTrue();
}
