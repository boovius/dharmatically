# **Dharmatically**

An activity tracking application. And boilerplate for apps using React-Native, Expo, and Supabase.

## **Global deps to install to development environment**

Expo CLI: `npm install -g expo-cli`

EAS (expo application services): `npm install -g eas-cli`

## Deep Links

Dharmatically's deep link URL scheme is: `dharmatically`. The deep link scheme is set in the `app.json` file.

Testing links in iOS from terminal:

```
xcrun simctl openurl booted "dharmatically://reset-password#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired"
```

Testing deep links in Android from terminal:

```
adb shell am start -W -a android.intent.action.VIEW -d "dharmatically://reset-password"

```
