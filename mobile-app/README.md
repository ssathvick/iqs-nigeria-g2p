# NigeriaG2P mobile prototype

An early Expo/React Native prototype for Android and iOS, with beneficiary and staff entry points. It opens the existing sandbox services in the device's browser; it does not implement native sign-in, offline registration, data synchronisation, notifications, payment or eligibility decisions. No credentials or beneficiary data are bundled. It is not an APK, IPA, released app or production-ready client.

## Run for development

1. Install a supported Node.js LTS release, clone the repository and open a terminal in `mobile-app/`.
2. Run `npm ci`, then `npx expo start`.
3. Open the development build on a compatible Android or iOS device using the Expo workflow. Android Studio is needed for a local Android emulator; a Mac with Xcode is needed for a local iOS build. Expo Go and SDK compatibility change, so check the official Expo instructions for SDK 58.
4. Choose **Beneficiary** or **Staff**. The action opens the corresponding public sandbox service in the operating system browser. A network connection and the correct sandbox account are required. Only fictional records should be used.

## Release work remaining

The product team must define actual mobile workflows, APIs, user and jurisdiction permissions, native OAuth/OIDC authorization-code + PKCE with secure return links, session lifecycle and device security. It must test registration, staff actions, accessibility, weak connectivity, errors and sign-out on real devices. The server remains a synthetic sandbox and requires its own production work. App icons, organization-owned Android application ID and Apple bundle identifier, signing keys, developer accounts, privacy disclosures and store submission materials must be supplied by the responsible owner. Neither release signing nor store publication is configured.

Apple's App Store requires meaningful app functionality beyond a repackaged website; this browser-launching preview is not a submission-ready iOS application. Review Apple and Google requirements before distribution. Do not place signing keys, account credentials or user data in this repository.

## Checks

`npm run lint`, `npm run typecheck` (JavaScript syntax/type infrastructure check; `checkJs` is disabled), and `npx expo export --platform android --platform ios --output-dir .expo-export` check the project and JS bundles. Export is not a native binary build and does not replace testing on devices. `npm audit` may report Expo transitive development-tool advisories; evaluate them before release rather than using a breaking automatic downgrade.
