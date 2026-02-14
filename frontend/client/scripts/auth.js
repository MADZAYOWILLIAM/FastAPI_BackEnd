// Authentication Module - Handle user auth and session
const Auth = (() => {
    const storageKeys = {
        token: 'authToken',
        user: 'currentUser'
    };

    // Get current user
    const getCurrentUser = () => {
        const user = localStorage.getItem(storageKeys.user);
        return user ? JSON.parse(user) : null;
    };

    // Set current user
    const setCurrentUser = (user) => {
        if (user) {
            localStorage.setItem(storageKeys.user, JSON.stringify(user));
        }
    };

    // Check if user is logged in
    const isLoggedIn = () => {
        return !!API.getToken();
    };

    // Get authorization header
    const getAuthHeader = () => {
        const token = API.getToken();
        return token ? `Bearer ${token}` : null;
    };

    // Handle login
    const login = async (email, password) => {
        try {
            const result = await API.auth.login(email, password);

            if (!result.success) {
                return {
                    success: false,
                    error: result.error || 'Login failed'
                };
            }

            const { access_token, token_type } = result.data;

            // Store token
            API.setToken(access_token);

            // Store user info (email from login)
            setCurrentUser({
                email: email,
                loginTime: new Date().toISOString()
            });

            return {
                success: true,
                token: access_token,
                tokenType: token_type
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };

    // Handle register
    const register = async (name, phone, email, password) => {
        try {
            const result = await API.auth.register(name, phone, email, password);

            if (!result.success) {
                return {
                    success: false,
                    error: result.error || 'Registration failed'
                };
            }

            // Do NOT auto-login - user must login separately
            return {
                success: true,
                message: 'Registration successful! Please login to continue.'
            };
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };

    // Handle logout
    const logout = () => {
        API.clearToken();
        localStorage.removeItem(storageKeys.user);
        window.location.href = '/pages/login.html';
    };

    // Check token validity
    const isTokenValid = () => {
        return !!API.getToken();
    };

    // Redirect to login if not authenticated
    const requireAuth = () => {
        if (!isLoggedIn()) {
            Toast.warning('Please log in to continue');
            setTimeout(() => {
                window.location.href = '/pages/login.html';
            }, 1500);
            return false;
        }
        return true;
    };

    return {
        login,
        register,
        logout,
        isLoggedIn,
        isTokenValid,
        getCurrentUser,
        setCurrentUser,
        getAuthHeader,
        requireAuth,
        storageKeys
    };
})();
