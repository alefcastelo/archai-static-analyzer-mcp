package com.alefcastelo.domain.usecase;

import com.alefcastelo.domain.model.User;
import com.alefcastelo.infrastructure.repository.UserRepository;

public class CreateUserUseCase {
    private final UserRepository userRepository;

    public CreateUserUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public void execute(User user) {
        userRepository.save(user);
    }

    public void handle(User user) {
        userRepository.save(user);
    }
}
