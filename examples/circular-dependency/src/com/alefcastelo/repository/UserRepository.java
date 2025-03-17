package com.alefcastelo.repository;

import com.alefcastelo.model.User;
import com.alefcastelo.provider.LoggerUserEventsProvider;

class UserRepository {
    private final LoggerUserEventsProvider loggerUserEventsProvider;

    public UserRepository(LoggerUserEventsProvider loggerUserEventsProvider) {
        this.loggerUserEventsProvider = loggerUserEventsProvider;
    }

    public User findByEmail(String email) {
        return new User("test@test.com", "password");
    }

    public User checkCredentials(String email, String password) {
        if (email == null || password == null) {
            return null;
        }

        loggerUserEventsProvider.logUserLoginByEmail(email);

        return new User(email, password);
    }
}