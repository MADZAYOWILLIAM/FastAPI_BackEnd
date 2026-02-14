// API Module - Handle HTTP requests
const API = (() => {
    const baseURL = 'http://localhost:8000';
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    // Get auth token from localStorage
    const getToken = () => {
        return localStorage.getItem('authToken');
    };

    // Set auth token
    const setToken = (token) => {
        if (token) {
            localStorage.setItem('authToken', token);
        }
    };

    // Clear auth token
    const clearToken = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    };

    // Get headers with auth
    const getHeaders = (customHeaders = {}) => {
        const headers = { ...defaultHeaders, ...customHeaders };
        const token = getToken();

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    };

    // Make request
    const request = async (method, endpoint, data = null, options = {}) => {
        const url = `${baseURL}${endpoint}`;
        const headers = getHeaders(options.headers);

        const config = {
            method,
            headers
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                config.body = data;
            } else {
                config.body = JSON.stringify(data);
            }
        }

        try {
            const response = await fetch(url, config);

            // Handle authentication errors
            if (response.status === 401) {
                clearToken();
                window.location.href = '/pages/login.html';
                throw new Error('Unauthorized');
            }

            // Handle no content responses
            if (response.status === 204) {
                return {
                    success: true,
                    data: null,
                    status: response.status
                };
            }

            const responseData = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(responseData?.detail || `HTTP ${response.status}`);
            }

            return {
                success: true,
                data: responseData,
                status: response.status
            };
        } catch (error) {
            console.error(`API Error (${method} ${endpoint}):`, error);
            return {
                success: false,
                error: error.message,
                status: null
            };
        }
    };

    // GET request
    const get = (endpoint, options = {}) => {
        return request('GET', endpoint, null, options);
    };

    // POST request
    const post = (endpoint, data, options = {}) => {
        return request('POST', endpoint, data, options);
    };

    // PUT request
    const put = (endpoint, data, options = {}) => {
        return request('PUT', endpoint, data, options);
    };

    // PATCH request
    const patch = (endpoint, data, options = {}) => {
        return request('PATCH', endpoint, data, options);
    };

    // DELETE request
    const del = (endpoint, options = {}) => {
        return request('DELETE', endpoint, null, options);
    };

    // Upload file
    const upload = async (endpoint, file, fieldName = 'file', additionalData = {}) => {
        const url = `${baseURL}${endpoint}`;
        const formData = new FormData();

        formData.append(fieldName, file);
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const headers = { ...defaultHeaders };
        delete headers['Content-Type']; // Let browser set it

        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            return {
                success: true,
                data: await response.json()
            };
        } catch (error) {
            console.error('Upload error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };

    // Health check
    const health = async () => {
        const result = await get('/');
        return result.success;
    };

    // ===================== AUTHENTICATION =====================
    const auth = {
        login: (email, password) => {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            return request('POST', '/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        register: (name, phone, email, password) => post('/register', {
            name,
            phone_number: phone,
            email,
            password
        })
    };

    // ===================== USERS =====================
    const users = {
        getAll: () => get('/user/'),
        getById: (id) => get(`/user/${id}`),
        create: (data) => post('/user/', data),
        update: (id, data) => put(`/user/${id}`, data),
        delete: (id) => del(`/user/${id}`)
    };

    // ===================== PROGRAMS =====================
    const programs = {
        getAll: () => get('/programs/'),
        getById: (id) => get(`/programs/${id}`),
        create: (data) => post('/programs/', data),
        update: (id, data) => put(`/programs/${id}`, data),
        delete: (id) => del(`/programs/${id}`)
    };

    // ===================== SERVICES =====================
    const services = {
        getAll: () => get('/services/'),
        getById: (id) => get(`/services/${id}`),
        create: (data) => post('/services/', data),
        update: (id, data) => put(`/services/${id}`, data),
        delete: (id) => del(`/services/${id}`)
    };

    // ===================== EVENTS =====================
    const events = {
        getAll: () => get('/event/'),
        getById: (id) => get(`/event/${id}`),
        create: (data) => post('/event/', data),
        update: (id, data) => put(`/event/${id}`, data),
        delete: (id) => del(`/event/${id}`)
    };

    // ===================== BLOG =====================
    const blog = {
        getAll: () => get('/blog/'),
        getById: (id) => get(`/blog/${id}`),
        create: (data) => post('/blog/', data),
        update: (id, data) => put(`/blog/${id}`, data),
        delete: (id) => del(`/blog/${id}`)
    };

    return {
        baseURL,
        request,
        get,
        post,
        put,
        patch,
        del,
        upload,
        health,
        getToken,
        setToken,
        clearToken,
        auth,
        users,
        programs,
        services,
        events,
        blog
    };
})();
