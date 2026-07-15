# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-04-14

### ✨ Added - New Checker SDK Support

- **New Checker SDK integration** with `configId` and `widgetKey` props
- **HTML injection approach** loading https://sdk.prembly.com/checker.js
- **PremblyChecker.init()** and **PremblyChecker.open()** flow implementation
- **Imperative ref API** with `open()` and `close()` methods for programmatic control
- **Metadata support** for passing custom data to verification flows
- **New callbacks**: `onComplete`, `onLoad`, `onClose` in addition to legacy callbacks
- **Auto-open functionality** via `autoOpen` prop
- **Close button** in modal with `showCloseButton` prop
- **Enhanced error handling** with try-catch and better error messages
- **Loading text customization** via `loadingText` prop
- **Configurable animation** via `animationType` prop ("slide", "fade", "none")
- **Better WebView error handling** with onError callback
- **Modal close support** via onRequestClose for Android back button

### 🔄 Changed

- **Migration from URL-based to HTML injection**: Widget now loads via HTML with embedded JavaScript instead of URL with query parameters
- **WebView source**: Changed from `{ uri: "..." }` to `{ html: generateHTML() }`
- **Event handling**: Enhanced to support both new Checker SDK events and legacy events
- **Loading indicator**: Improved positioning and styling with semi-transparent overlay
- **Console logging**: Added detailed event logging with emojis for better debugging

### ✅ Maintained - Full Backward Compatibility

- **Legacy API fully supported**: All v1.x props (`merchant_key`, `config_id`, `first_name`, etc.) continue to work
- **Legacy callbacks work**: `onVerified`, `onCancel`, `onError` still function as expected
- **Automatic API detection**: Library intelligently chooses between new and legacy API based on props provided
- **No breaking changes**: Existing v1.x implementations work without modifications

### 📊 Technical Improvements

- Added `useImperativeHandle` for ref methods
- Enhanced postMessage bridge for better WebView ↔ React Native communication
- Improved error parsing with try-catch blocks
- Better HTML generation with proper escaping
- Enhanced WebView configuration (javaScriptEnabled, domStorageEnabled, allowsInlineMediaPlayback)
- Improved modal management with proper cleanup

### 📚 Documentation

- Comprehensive README with migration guide
- Separate examples for new and legacy API
- Complete API reference with all props documented
- Troubleshooting section added
- Visual improvements to example app with better UI

### 🎯 Migration Path

**New API (Recommended):**
```javascript
<IdentityKyc
  configId="d93f22bd-7b3f-4563-ae9a-fcafd1ac858e"
  widgetKey="wdgt_5d47ed6878d94cbc90ba37ac472cbce4"
  metadata={{ user_id: '123' }}
  onComplete={(data) => console.log(data)}
/>
```

**Legacy API (Still Supported):**
```javascript
<IdentityKyc
  merchant_key="YOUR_KEY"
  config_id="YOUR_CONFIG"
  first_name="John"
  onVerified={(data) => console.log(data)}
/>
```

## [1.1.1] - Previous Release

### Features
- URL-based WebView approach
- merchant_key and config_id authentication
- Basic callbacks: onVerified, onCancel, onError
- Custom button support
- Android and iOS support

---

## Upgrade Guide

### From v1.x to v2.0

#### Option 1: Use New Checker SDK (Recommended)

1. Get new credentials from [Prembly Dashboard](https://dashboard.prembly.com)
2. Replace props:
   - `merchant_key` → Not needed (use `configId` and `widgetKey`)
   - `config_id` → Not needed (use `configId` and `widgetKey`)
   - `onVerified` → `onComplete` (or keep `onVerified` for compatibility)
3. Optionally use new features: metadata, ref methods, auto-open

#### Option 2: Keep Using Legacy API

No changes needed! Your v1.x code continues to work exactly as before.

---

## Breaking Changes

**None.** Version 2.0.0 maintains full backward compatibility with v1.x.

---

## Support

- 📧 Email: support@prembly.com
- 🐛 Issues: [GitHub Issues](https://github.com/prembly/react-native-identity-kyc/issues)
- 📚 Documentation: [Prembly Docs](https://docs.prembly.com)

---

**Note:** Version 2.0.0 is a major upgrade focused on adding new capabilities while preserving all existing functionality. No action is required for existing users, but we recommend migrating to the new Checker SDK API for better features and performance.
