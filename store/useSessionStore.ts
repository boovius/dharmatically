import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';

interface SessionState {
  session: Session | null;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
}

const useSessionStore = create<SessionState>((set) => ({
  session: null,
  setSession: (session) => { console.log('setting session in zustand store', session); set({ session })},
  clearSession: () => set({ session: null }),
}));

export default useSessionStore;