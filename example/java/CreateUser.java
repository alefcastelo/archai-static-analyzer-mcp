package com.alefcastelo.domain.usecase;

import com.alefcastelo.domain.model.User;
import com.alefcastelo.infrastructure.repository.UserRepository;

public class CreateUser {
    private final CreateUserInputValidator createUserInputValidator;
    private final CreateUserInputAdapter createUserInputAdapter;
    private final UserRepository userRepository;
    private final UserCreatedEventPublisher userCreatedEventPublisher;
    private final UserOutputAdapter userOutputAdapter;

    public CreateUser(
        CreateUserInputValidator createUserInputValidator,
        CreateUserInputAdapter createUserInputAdapter,
        UserRepository userRepository,
        UserCreatedEventPublisher userCreatedEventPublisher,
        UserOutputAdapter userOutputAdapter,
    ) {
        this.createUserInputValidator = createUserInputValidator;
        this.createUserInputAdapter = createUserInputAdapter;
        this.userRepository = userRepository;
        this.userCreatedEventPublisher = userCreatedEventPublisher;
        this.userOutputAdapter = userOutputAdapter;
    }
    
    public User execute(User user) {
        createUserInputValidator.validate(user);
        User user = createUserInputAdapter.adapt(user);
        userRepository.save(user);
        userCreatedEventPublisher.publish(user);
        return userOutputAdapter.output(user);
    }

    public void handle(User user) {
        this.execute(user);
    }
}