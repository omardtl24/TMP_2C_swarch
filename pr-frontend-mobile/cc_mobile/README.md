# CC Mobile Application

This repository contains the mobile application for the CC project built with Flutter.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Option 1: Using Emulator/Simulator](#option-1-using-emulatorsimulator)
  - [Option 2: Building and Installing APK](#option-2-building-and-installing-apk)
  - [Option 3: Running on Physical Device via USB](#option-3-running-on-physical-device-via-usb)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

<!-- Add your project overview here -->

## Prerequisites

- Flutter (latest stable version)
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)
- Git
- Physical Android/iOS device or emulator/simulator

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cc_mobile
   ```

2. Install dependencies:
   ```bash
   flutter pub get
   ```

## Running the Application

### Option 1: Using Emulator/Simulator

#### Set Up an Android Emulator
1. Open Android Studio
2. Go to **Tools > Device Manager**
3. Click **Create device** and select a device definition (e.g., Pixel 6)
4. Choose a system image (recommendation: latest stable release with Google Play)
5. Complete the setup and start the emulator

#### Run the App
1. Ensure you're in the project directory:
   ```bash
   cd cc_mobile
   ```

2. Clean the project and get dependencies:
   ```bash
   flutter clean
   flutter pub get
   ```

3. Run the app:
   - **Using VS Code**:
     - Open `lib/main.dart`
     - Click "Run" in debug mode
   - **Using Terminal**:
     ```bash
     flutter run
     ```

### Option 2: Building and Installing APK

1. Ensure Flutter is installed and added to your PATH
2. Navigate to the project directory:
   ```bash
   cd cc_mobile
   ```

3. Configure Environment Variables for Network Access:
   - Make sure your laptop and mobile device are connected to the same network (WiFi)
   - Find your PC's local IP address:
     - **Windows**:
       ```bash
       ipconfig
       ```
       Look for "IPv4 Address" (e.g. `192.168.1.42`)
       
     - **macOS/Linux**:
       ```bash
       ifconfig
       ```
       Find the `inet` entry under your active network interface (e.g. `192.168.1.42`)

4. Verify API Gateway Accessibility:
   - **Linux/macOS**:
     ```bash
     sudo netstat -tuln | grep ':8000'
     # Or using lsof
     sudo lsof -i TCP:8000 -sTCP:LISTEN
     ```
     
   - **Windows**:
     ```bash
     netstat -an | findstr ":8000"
     ```
     Look for `TCP 0.0.0.0:8000 0.0.0.0:0 LISTENING`

5. If port 8000 is not accessible:
   - **Windows**:
     - Open Windows Defender Firewall
     - Click "Advanced settings" → "Inbound Rules" → "New Rule..."
     - Select "Port" → "TCP" → Enter "8000" → Allow the connection
     - Name it "API Gateway" and finish the wizard
     
   - **macOS**:
     - Go to System Preferences → Security & Privacy → Firewall
     - Click "Firewall Options" → "+" → Add your application
     
   - **Linux**:
     ```bash
     sudo ufw allow 8000/tcp
     sudo ufw reload
     ```

6. Update your `.env` file in the project root:
   ```env
   API_GATEWAY_URL=http://<your_ip>:8000
   ```
   Replace `<your_ip>` with your actual local IP address

7. Build the APK:
   ```bash
   flutter clean
   flutter pub get
   flutter build apk --debug
   ```
   The APK will be generated at: `build/app/outputs/flutter-apk/app-debug.apk`

8. Install the APK on your device:
   - Transfer the APK to your Android device using USB, email, or cloud storage
   - On your Android device, navigate to the APK file and tap to install
   - You may need to enable "Install from Unknown Sources" in your device's security settings

### Option 3: Running on Physical Device via USB

1. Enable Developer Options on your Android device:
   - Go to **Settings > About phone**
   - Find **Build number** (location varies by device manufacturer)
   - Tap on **Build number** 7 times until you see "You are now a developer!" message
   - A new **Developer options** menu will appear in your Settings

2. Enable USB Debugging:
   - Go to **Settings > System > Developer options** (On some devices: **Settings > Additional settings > Developer options**)
   - Enable the **USB debugging** toggle
   - Connect your device to your computer via USB
   - On your device, allow USB debugging when prompted

3. Verify device connection:
   ```bash
   flutter devices
   ```
   Your physical device should appear in the list

4. Run the app:
   - Navigate to the project folder:
     ```bash
     cd cc_mobile
     ```

   - Update your `.env` file with the correct API Gateway URL as explained in Option 2

   - **Using VS Code**:
     - Open the project folder in VS Code
     - Connect your device and select it in the status bar device selector
     - Locate the `lib/main.dart` file
     - Click on "Run > Start Debugging" or press F5

   - **Using Terminal**:
     ```bash
     flutter run
     ```
     If you have multiple devices connected, specify your physical device:
     ```bash
     flutter run -d <device_id>
     ```
     (Get the device_id from `flutter devices` command)

## Environment Configuration

The application uses environment variables for configuration. Create a `.env` file in the project root with the following variables:

```
API_GATEWAY_URL=http://<your_ip>:8000
```

Replace `<your_ip>` with your local network IP address when running the API backend locally.

## Troubleshooting

### Device Connection Issues
- Try different USB ports or cables
- Install device-specific USB drivers for your Android device model
- On Windows, install the Google USB Driver from Android SDK Manager:
  In Android Studio: **Tools > SDK Manager > SDK Tools tab > Google USB Driver**

### Network Connectivity
- Ensure your mobile device and computer are connected to the same network
- Check if your API Gateway is accessible from other devices on the network
- Verify firewall settings to allow connections on port 8000

### Build Errors
- Run `flutter clean` and `flutter pub get` before building
- Check for outdated dependencies in `pubspec.yaml`
- Ensure you have the latest Flutter SDK installed

