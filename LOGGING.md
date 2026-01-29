# Logging System

This application now includes a comprehensive logging system to help track errors, component lifecycle, and user interactions.

## Features

### 1. **Logger Utility** (`utils/logger.js`)
A centralized logging utility that provides:
- **Log Levels**: DEBUG, INFO, WARN, ERROR
- **Timestamps**: Automatic timestamping of all logs
- **Context**: Captures user agent and URL information
- **Structured Logging**: Consistent log format across the application

#### Usage:
```javascript
import logger from '../utils/logger'

// Basic logging
logger.debug('Debug message', { data: 'optional' })
logger.info('Info message')
logger.warn('Warning message')
logger.error('Error message', error)

// Specialized logging
logger.navigation('/about', '/') // Track page navigation
logger.component('MyComponent', 'mounted', { props }) // Track component lifecycle
logger.fetchError(url, error, context) // Track fetch errors
logger.imageError(src, error) // Track image load errors
```

### 2. **Error Boundary** (`components/ErrorBoundary.js`)
React Error Boundary that catches errors in the component tree:
- Displays user-friendly error message
- Shows detailed error info in development mode
- Logs all caught errors to the logger
- Provides refresh button to recover

### 3. **Global Error Handler** (`components/GlobalErrorHandler.js`)
Catches all unhandled errors at the window level:
- Unhandled JavaScript errors
- Unhandled promise rejections
- Resource loading errors (images, scripts, stylesheets)
- Network fetch errors

### 4. **Image Logger** (`utils/imageLogger.js`)
Specialized utilities for tracking image loading:
```javascript
import { logImageError, verifyImageExists } from '../utils/imageLogger'

// Verify an image exists before using it
const exists = await verifyImageExists('/path/to/image.jpg')

// Log image errors
logImageError('/path/to/image.jpg', error)
```

## Implementation

The logging system is integrated at multiple levels:

1. **Root Layout** (`app/layout.js`): Wraps entire app with ErrorBoundary and GlobalErrorHandler
2. **Components**: Individual components use logger for lifecycle and error tracking
3. **Pages**: Pages log navigation and component-specific events

## Viewing Logs

### Development Mode
- Open browser DevTools (F12 or Cmd+Option+I)
- Go to Console tab
- All logs are color-coded by level:
  - 🐛 DEBUG (gray)
  - ℹ️ INFO (blue)
  - ⚠️ WARN (yellow)
  - ❌ ERROR (red)

### Production Mode
- Only WARN and ERROR level logs are shown
- Errors include full stack traces
- Ready to integrate with external logging services (Sentry, LogRocket, etc.)

## Common Error Patterns

### "Failed to fetch" Errors
These are typically caused by:
1. Network connectivity issues
2. CORS problems
3. External services being unavailable
4. Browser extensions blocking requests

The logger will capture:
- The URL being fetched
- Error message and stack trace
- Context about where the fetch was initiated

### Image Loading Errors
The logger tracks:
- Which images failed to load
- The source path
- Component context

### Unhandled Promise Rejections
Catches async errors that weren't handled with try/catch

## Extending the Logger

To add external logging service integration:

```javascript
// In utils/logger.js, add to _log method:
_sendToExternalService(logData) {
  // Send to Sentry, LogRocket, Datadog, etc.
  if (logData.level === 'ERROR') {
    // Sentry.captureException(logData)
  }
}
```

## Best Practices

1. **Use appropriate log levels**:
   - DEBUG: Detailed technical information
   - INFO: General informational messages
   - WARN: Potentially harmful situations
   - ERROR: Error events

2. **Include context**: Always pass relevant data with logs
3. **Don't log sensitive data**: Never log passwords, tokens, or PII
4. **Group related logs**: Use `logger.group()` for related operations

## Troubleshooting

If you're seeing unexpected errors:
1. Check the Console for detailed error messages
2. Look for the full stack trace
3. Note the timestamp and URL context
4. Check for patterns (e.g., only on certain pages)

The logging system will help identify:
- Missing images or resources
- Network issues
- Component rendering errors
- Navigation problems
