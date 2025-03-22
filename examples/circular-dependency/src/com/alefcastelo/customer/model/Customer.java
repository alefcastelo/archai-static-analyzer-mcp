package com.alefcastelo.customer.model;

import com.alefcastelo.account.model.Account;

class Customer {
    protected String name;
    protected Account account;

    public Customer(String name, Account account) {
        this.name = name;
        this.account = account;
    }

    public String getName() {
        return name;
    }

    public Account getAccount() {
        return account;
    }
}