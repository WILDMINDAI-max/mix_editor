import axios from 'axios';

// Get base URL from env, default to local API gateway if not set
const resolvedBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000').trim();

const axiosInstance = axios.create({
    baseURL: resolvedBaseUrl,
    withCredentials: true,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Try to extract ID token from localStorage
const getStoredIdToken = (): string | null => {
    try {
        const directToken = localStorage.getItem('authToken');
        if (directToken && directToken.startsWith('eyJ')) {
            return directToken;
        }

        const userString = localStorage.getItem('user');
        if (userString) {
            const userObj = JSON.parse(userString);
            const token = userObj?.idToken || userObj?.token || null;
            if (token && token.startsWith('eyJ')) {
                return token;
            }
        }

        if (directToken) {
            try {
                const authToken = JSON.parse(directToken);
                const token = authToken?.accessToken || authToken?.idToken || authToken?.token || null;
                if (token && token.startsWith('eyJ')) {
                    return token;
                }
            } catch (e) {
                if (directToken.startsWith('eyJ')) {
                    return directToken;
                }
            }
        }
        return null;
    } catch (err) {
        return null;
    }
};

// Request interceptor to attach Bearer token
axiosInstance.interceptors.request.use(async (config) => {
    try {
        const token = getStoredIdToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Attach device headers for tracking logs
        let deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
            deviceId = `${Date.now()}-${Math.random()}`;
            localStorage.setItem('device_id', deviceId);
        }
        config.headers['X-Device-Id'] = deviceId;
    } catch (e) {
        console.error('API Interceptor Error:', e);
    }
    return config;
});

// Response interceptor to handle 401s
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            console.warn('[API][401] Unauthorized - clearing auth data');
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            
            // Redirect to login if in browser
            if (typeof window !== 'undefined') {
                const loginUrl = (process.env.NEXT_PUBLIC_LOGIN_URL || 'http://localhost:3000/view/signup').trim();
                const currentUrl = window.location.href;
                window.location.href = `${loginUrl}?next=${encodeURIComponent(currentUrl)}&toast=SESSION_EXPIRED`;
            }
        }
        return Promise.reject(error);
    }
);

export const getApiClient = () => axiosInstance;

export default axiosInstance;
