import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://umezbughvumjedtuejqt.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtZXpidWdodnVtamVkdHVlanF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNTgzMzcsImV4cCI6MjA1MjYzNDMzN30.VzbDfjcnvIO2UQWHiTeUbwT6kRiID_QfuuOOpgJvxEY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})