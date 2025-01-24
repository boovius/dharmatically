import React, { useState } from 'react'
import { Input } from '@rneui/themed'

interface PasswordInputProps {
  value: string
  onChangeText: (text: string) => void
}

export default function PasswordInput({ value, onChangeText }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Input
      label="Password"
      leftIcon={{ type: 'font-awesome', name: 'lock' }}
      rightIcon={{
        type: 'font-awesome',
        name: showPassword ? 'eye-slash' : 'eye',
        onPress: () => setShowPassword(!showPassword)
      }}
      onChangeText={onChangeText}
      value={value}
      secureTextEntry={!showPassword}
      placeholder="Password"
      autoCapitalize={'none'}
    />
  )
}
