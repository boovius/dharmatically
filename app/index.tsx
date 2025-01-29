import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { router } from 'expo-router'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  const nav = (session: Session | null) => {
    if (session && session.user) {
      router.replace('/activities')
    } else {
      console.log('No session')
      router.replace('/auth')
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      nav(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      nav(session)
    })
  }, [])

  return <View/>
}