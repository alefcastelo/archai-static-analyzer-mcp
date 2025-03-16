package com.alefcastelo.domain.usecase;

import com.alefcastelo.domain.model.User;
import com.alefcastelo.infrastructure.repository.UserRepository;

@Component
public class CreateUser {
    protected final CreateUserInputValidator createUserInputValidator;
    private final CreateUserInputAdapter createUserInputAdapter;
    protected final UserRepository userRepository;
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
    
    @Override
    private User execute(User user) {
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