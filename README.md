# Blitz - Mobile Location Discovery App

Blitz is a mobile-first location discovery app that helps users find amazing places and experiences around them. Built with React, TypeScript, and Capacitor for native mobile deployment.

## 🚀 Features

- **Native Mobile App**: Optimized for iOS and Android deployment
- **Location-Based Discovery**: Find places near your current location
- **Smart Filtering**: Filter by type, price, distance, and more
- **Natural Language Search**: Describe what you're looking for in plain text
- **Tinder-Style Swiping**: Swipe through place cards to like or skip
- **Native Features**: Camera, geolocation, haptic feedback, and more
- **Offline Support**: Works without internet connection
- **Push Notifications**: Get notified about new places and recommendations

## 📱 Mobile Deployment

### Prerequisites

- Node.js 18+ and npm
- Xcode (for iOS development)
- Android Studio (for Android development)
- Capacitor CLI: `npm install -g @capacitor/cli`

### Setup for Mobile Development

1. **Install dependencies:**
```bash
npm install
```

2. **Build the web app:**
```bash
npm run build
```

3. **Add mobile platforms:**
```bash
# Add iOS platform
npm run cap:add:ios

# Add Android platform  
npm run cap:add:android
```

4. **Sync web assets to native projects:**
```bash
npm run cap:sync
```

### iOS Deployment

1. **Open iOS project in Xcode:**
```bash
npm run cap:open:ios
```

2. **Configure signing & capabilities in Xcode:**
   - Set your development team
   - Configure bundle identifier (com.yourcompany.blitz)
   - Enable required capabilities (Location, Camera, etc.)

3. **Build and run:**
   - Select your device/simulator
   - Click the play button in Xcode

4. **For App Store deployment:**
   - Archive the project in Xcode
   - Upload to App Store Connect
   - Submit for review

### Android Deployment

1. **Open Android project in Android Studio:**
```bash
npm run cap:open:android
```

2. **Configure app signing:**
   - Generate a signed APK/AAB
   - Configure release signing in `android/app/build.gradle`

3. **Build and run:**
   - Select your device/emulator
   - Click the run button in Android Studio

4. **For Play Store deployment:**
   - Generate signed AAB (Android App Bundle)
   - Upload to Google Play Console
   - Submit for review

### Development Scripts

```bash
# Development
npm run dev                 # Start web development server
npm run build              # Build for production
npm run cap:sync           # Sync web assets to native projects

# iOS
npm run cap:run:ios        # Build and run on iOS
npm run build:ios          # Build web app and open iOS project

# Android  
npm run cap:run:android    # Build and run on Android
npm run build:android      # Build web app and open Android project
```

## 🔧 Mobile Optimizations

### Performance
- **Touch-optimized components** with proper touch targets (44px minimum)
- **Haptic feedback** for better user experience
- **Safe area support** for modern iOS devices
- **Optimized animations** for 60fps performance
- **Lazy loading** for images and components

### Native Features
- **Geolocation**: High-accuracy location services
- **Camera**: Photo capture and gallery access
- **Haptics**: Tactile feedback for interactions
- **Status Bar**: Proper styling for each platform
- **Splash Screen**: Branded loading experience
- **Push Notifications**: Engagement and retention
- **Share API**: Native sharing capabilities

### UI/UX
- **Mobile-first design** with responsive breakpoints
- **Gesture navigation** optimized for mobile
- **Dark/Light mode** with system preference detection
- **Accessibility** features for inclusive design
- **Offline indicators** and graceful degradation

## 📋 App Store Requirements

### iOS App Store
- **App Icons**: All required sizes (1024x1024 for store, various sizes for app)
- **Screenshots**: Required for all supported device sizes
- **Privacy Policy**: Required for location and camera usage
- **App Description**: Compelling store listing
- **Keywords**: Optimized for App Store search
- **Age Rating**: Appropriate content rating
- **Permissions**: Clear usage descriptions in Info.plist

### Google Play Store
- **App Icons**: Adaptive icon and legacy icons
- **Screenshots**: Required for phones and tablets
- **Feature Graphic**: 1024x500 promotional image
- **Privacy Policy**: Required for location and camera usage
- **App Description**: Compelling store listing
- **Content Rating**: IARC questionnaire completion
- **Permissions**: Clear usage descriptions in manifest

## 🔐 Required Permissions

### iOS (Info.plist)
- `NSLocationWhenInUseUsageDescription`: Location access for finding nearby places
- `NSCameraUsageDescription`: Camera access for sharing photos
- `NSPhotoLibraryUsageDescription`: Photo library access for sharing

### Android (AndroidManifest.xml)
- `ACCESS_FINE_LOCATION`: Precise location for nearby places
- `ACCESS_COARSE_LOCATION`: Approximate location fallback
- `CAMERA`: Camera access for photo capture
- `READ_EXTERNAL_STORAGE`: Photo library access
- `INTERNET`: API calls and data sync
- `VIBRATE`: Haptic feedback

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Test on physical devices (iOS and Android)
- [ ] Verify all native features work correctly
- [ ] Test offline functionality
- [ ] Validate app icons and splash screens
- [ ] Review and update privacy policy
- [ ] Test app store screenshots
- [ ] Verify deep linking (if applicable)

### iOS Deployment
- [ ] Configure proper bundle identifier
- [ ] Set up development/distribution certificates
- [ ] Configure provisioning profiles
- [ ] Test on TestFlight
- [ ] Submit for App Store review

### Android Deployment
- [ ] Generate signed release build
- [ ] Test release APK/AAB
- [ ] Upload to Play Console
- [ ] Configure store listing
- [ ] Submit for Play Store review

## 📞 Support

For deployment issues or questions:
- Check Capacitor documentation: https://capacitorjs.com/docs
- iOS deployment guide: https://capacitorjs.com/docs/ios/deploying-to-app-store
- Android deployment guide: https://capacitorjs.com/docs/android/deploying-to-google-play

## 📄 License

This project is licensed under the MIT License.