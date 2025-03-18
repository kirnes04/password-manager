package com.example.hw.service.Implementation;

import com.example.hw.DirectoryMapper;
import com.example.hw.dto.DirectoryDTO;
import com.example.hw.entities.Directory;
import com.example.hw.entities.User;
import com.example.hw.repository.DirectoryRepository;
import com.example.hw.repository.UserRepository;
import com.example.hw.service.DirectoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class DirectoryServiceImpl implements DirectoryService {
    private static final Logger logger = LoggerFactory.getLogger(DirectoryServiceImpl.class);
    private final UserRepository userRepository;
    private final DirectoryRepository directoryRepository;
    private final DirectoryMapper directoryMapper;

    public DirectoryServiceImpl(UserRepository userRepository, DirectoryRepository directoryRepository, DirectoryMapper directoryMapper) {
        this.userRepository = userRepository;
        this.directoryRepository = directoryRepository;
        this.directoryMapper = directoryMapper;
        logger.info("Initializing DirectoryServiceImpl");
    }

    @Override
    public Directory createDirectory(String name, Integer parentId, String email) {
        logger.debug("Creating directory '{}' with parent {} for user: {}", name, parentId, email);
        var userId = userRepository.findIdByEmail(email);
        if (directoryRepository.getDirectoriesByName(name, parentId, userId).isPresent()) {
            logger.warn("Failed to create directory: directory '{}' already exists in parent {}", name, parentId);
            throw new IllegalArgumentException(String.format("Directory with name %s already exists", name));
        }

        var dir = directoryRepository.findById(parentId);
        if (dir.isEmpty() || !Objects.equals(dir.get().getUserId(), userId)) {
            logger.warn("Failed to create directory: invalid parent directory {} for user {}", parentId, email);
            throw new IllegalArgumentException("Wrong parent directory id");
        }

        var directory = new Directory(0, name, userId, parentId);
        Directory savedDirectory = directoryRepository.save(directory);
        logger.info("Successfully created directory '{}' with id {}", name, savedDirectory.getId());
        return savedDirectory;
    }

    @Override
    public List<DirectoryDTO> getDirectories(String email, Integer parentId) {
        logger.debug("Retrieving directories for user: {} with parent: {}", email, parentId);
        List<DirectoryDTO> directories = directoryMapper.toDto(directoryRepository.getAllByUserId(userRepository.findIdByEmail(email), parentId));
        logger.debug("Found {} directories", directories.size());
        return directories;
    }

    @Override
    public Directory createRootDirectory(Integer userId) {
        logger.debug("Creating parent directory root for user: {}", userId);
        var directory = new Directory(0, "root", userId, 0);
        Directory savedDirectory = directoryRepository.save(directory);
        logger.info("Successfully created parent directory root with id {}", savedDirectory.getId());
        return savedDirectory;
    }

    @Override
    public Directory getRootDirectory(String email) {
        logger.debug("Retrieving root directory for user: {}", email);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Directory directory = directoryRepository.getRootDirectory(user.getId());
        logger.debug("Found root directory {}", directory.getId());
        return directory;
    }

    @Override
    public Directory getParentByDirectoryId(Integer directoryId) {
        logger.debug("Retrieving parent directory for directory: {}", directoryId);
        Optional<Directory> directory = directoryRepository.getParentByDirectoryId(directoryId);
        if (directory.isPresent()) {
            logger.debug("Found parent directory {}", directory.get().getId());
            return directory.get();
        } else {
            logger.warn("Failed to retrieve parent directory for directory: {}", directoryId);
            return null;
        }
    }

    @Override
    public List<Directory> getChildrenByDirectoryId(Integer directoryId) {
        logger.debug("Retrieving children directories for directory: {}", directoryId);
        List<Directory> directory = directoryRepository.getChildrenByDirectoryId(directoryId);
        logger.debug("Found children directories {}", directory);
        return directory;
    }
}
