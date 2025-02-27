# **Dharmatically**

An activity tracking application. And boilerplate for apps using React-Native, Expo, and Supabase.

## **Global deps to install to development environment**

Expo CLI: `npm install -g expo-cli`

EAS (expo application services): `npm install -g eas-cli`

## Deep Links



Testing deep links in Android from terminal:

```
adb shell am start -W -a android.intent.action.VIEW -d "dharmatically://reset-password"

```
