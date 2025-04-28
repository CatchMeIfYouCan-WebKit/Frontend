import { create } from 'zustand';

const useFindIdStore = create((set) => ({
  phone: '',
  code: '',
  setPhone: (phone) => set({ phone }),
  setCode: (code) => set({ code }),
}));

export default useFindIdStore;
