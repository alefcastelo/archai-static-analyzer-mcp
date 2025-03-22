package com.alefcastelo.user.model;

import com.alefcastelo.customer.model.Customer;

class User {
    protected String email;
    protected String password;
    protected Customer customer;

    public User(String email, String password, Customer customer) {
        this.email = email;
        this.password = password;
        this.customer = customer;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Customer getCustomer() {
        return customer;
    }
}