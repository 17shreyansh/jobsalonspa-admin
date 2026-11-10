import { create } from 'zustand';

const useAuthStore = create((set) => ({
    admin: JSON.parse(localStorage.getItem('admin') || 'null'),
    isAuthenticated: !!localStorage.getItem('accessToken'),

    setAuth: (admin, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('admin', JSON.stringify(admin));
        set({ admin, isAuthenticated: true });
    },

    logout: () => {
        localStorage.clear();
        set({ admin: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
