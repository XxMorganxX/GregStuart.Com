/**
 * Logging utility for the application
 * Provides structured logging with different log levels
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

class Logger {
  constructor() {
    this.level = process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG
    this.enableTimestamps = true
  }

  _shouldLog(level) {
    return level >= this.level
  }

  _formatMessage(level, message, data) {
    const timestamp = this.enableTimestamps ? `[${new Date().toISOString()}]` : ''
    const levelStr = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level)
    
    return {
      timestamp,
      level: levelStr,
      message,
      data,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    }
  }

  _log(level, message, data = null) {
    if (!this._shouldLog(level)) return

    const logData = this._formatMessage(level, message, data)
    const consoleMessage = `${logData.timestamp} [${logData.level}] ${message}`

    switch (level) {
      case LOG_LEVELS.DEBUG:
        console.debug(consoleMessage, data)
        break
      case LOG_LEVELS.INFO:
        console.info(consoleMessage, data)
        break
      case LOG_LEVELS.WARN:
        console.warn(consoleMessage, data)
        break
      case LOG_LEVELS.ERROR:
        console.error(consoleMessage, data)
        if (data instanceof Error) {
          console.error('Stack trace:', data.stack)
        }
        break
      default:
        console.log(consoleMessage, data)
    }

    // You can extend this to send logs to an external service
    // this._sendToExternalService(logData)
  }

  debug(message, data) {
    this._log(LOG_LEVELS.DEBUG, message, data)
  }

  info(message, data) {
    this._log(LOG_LEVELS.INFO, message, data)
  }

  warn(message, data) {
    this._log(LOG_LEVELS.WARN, message, data)
  }

  error(message, data) {
    this._log(LOG_LEVELS.ERROR, message, data)
  }

  // Special method for tracking navigation
  navigation(page, fromPage = null) {
    this.info('Navigation', { to: page, from: fromPage })
  }

  // Special method for tracking component lifecycle
  component(componentName, action, data = null) {
    this.debug(`Component: ${componentName}`, { action, data })
  }

  // Special method for tracking fetch errors
  fetchError(url, error, context = null) {
    this.error('Fetch Error', {
      url,
      error: error.message,
      stack: error.stack,
      context,
    })
  }

  // Special method for tracking image load errors
  imageError(src, error) {
    this.error('Image Load Error', { src, error: error.message })
  }

  // Method to group related logs
  group(label, callback) {
    if (typeof console.group === 'function') {
      console.group(label)
      try {
        callback()
      } finally {
        console.groupEnd()
      }
    } else {
      callback()
    }
  }
}

// Create singleton instance
const logger = new Logger()

export default logger
