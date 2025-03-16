package com.alefcastelo.domain.model;

class Other {
    protected String email;
    protected String password;

    public Other(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}