package com.alefcastelo.provider;

import com.alefcastelo.model.User;
import com.alefcastelo.repository.UserRepository;

public class LoggerUserEventsProvider {
    private final Logger logger;
    private final UserRepository userRepository;
    
    public LoggerUserEventsProvider(Logger logger, UserRepository userRepository) {
        this.logger = logger;
        this.userRepository = userRepository;
    }

    public void logUserLoginByEmail(String email) {
        final User user = userRepository.checkCredentials(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        logger.log("User " + user.getEmail() + " logged in");
    }
}