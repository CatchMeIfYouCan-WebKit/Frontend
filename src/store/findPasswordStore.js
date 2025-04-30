// src/store/findPasswordStore.js
import { create } from 'zustand';

const useFindPasswordStore = create((set) => ({
    phone: '',
    code: '',
    setPhone: (phone) => set({ phone }),
    setCode: (code) => set({ code }),
}));

export default useFindPasswordStore;
