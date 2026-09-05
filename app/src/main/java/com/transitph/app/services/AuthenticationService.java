package com.transitph.app.services;

import android.content.Context;
import com.transitph.app.database.UserDao;
import com.transitph.app.models.User;
import com.transitph.app.utils.SessionManager;

public class AuthenticationService {
    private final UserDao userDao;
    private final SessionManager sessionManager;

    public AuthenticationService(Context context) {
        this.userDao = new UserDao(context);
        this.sessionManager = new SessionManager(context);
    }

    public static class AuthResult {
        private final boolean success;
        private final String message;
        private final User user;

        public AuthResult(boolean success, String message, User user) {
            this.success = success;
            this.message = message;
            this.user = user;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public User getUser() { return user; }
    }

    public AuthResult login(String email, String password) {
        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return new AuthResult(false, "Please enter your email and password.", null);
        }

        User user = userDao.authenticate(email.trim(), password);
        if (user == null) {
            return new AuthResult(false, "Invalid email or password.", null);
        }

        sessionManager.createLoginSession(user);
        return new AuthResult(true, "Login successful.", user);
    }

    public AuthResult register(String fullName, String email, String password, String confirmPassword) {
        if (fullName == null || fullName.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            password == null || password.trim().isEmpty() ||
            confirmPassword == null || confirmPassword.trim().isEmpty()) {
            return new AuthResult(false, "All fields are required.", null);
        }

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email.trim()).matches()) {
            return new AuthResult(false, "Please enter a valid email address.", null);
        }

        if (password.length() < 6) {
            return new AuthResult(false, "Password must be at least 6 characters long.", null);
        }

        if (!password.equals(confirmPassword)) {
            return new AuthResult(false, "Passwords do not match.", null);
        }

        if (userDao.isEmailTaken(email.trim())) {
            return new AuthResult(false, "An account with this email already exists.", null);
        }

        long userId = userDao.registerUser(fullName.trim(), email.trim(), password, "USER");
        if (userId > 0) {
            User newUser = userDao.getUserById(userId);
            return new AuthResult(true, "Account created successfully.", newUser);
        } else {
            return new AuthResult(false, "Registration failed. Please try again.", null);
        }
    }

    public void logout() {
        sessionManager.logoutUser();
    }
}
