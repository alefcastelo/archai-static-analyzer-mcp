package com.alefcastelo.account.model;

import com.alefcastelo.user.model.User;

class Account {
    protected User owner;

    public Account(User owner) {
        this.owner = owner;
    }

    public User getOwner() {
        return owner;
    }
}