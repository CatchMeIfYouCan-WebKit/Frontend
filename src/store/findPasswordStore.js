// src/store/findPasswordStore.js
import { create } from 'zustand';

const useFindPasswordStore = create((set) => ({
    phone: '',
    code: '',
    loginId: '',
    setPhone: (phone) => set({ phone }),
    setCode: (code) => set({ code }),
    setLoginId: (loginId) => set({ loginId }),
}));

export default useFindPasswordStore;
