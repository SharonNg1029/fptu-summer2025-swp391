/**
 * Console Filter Utility
 * 
 * This utility overrides the standard console methods to filter out 
 * all non-essential console messages in all environments.
 */

// Store original console methods
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  debug: console.debug,
  error: console.error
};

// Create a filtered error function to suppress unwanted messages
const filteredError = (message, ...args) => {
  // Skip if the message includes any of these patterns
  const ignorePatterns = [
    '-ms-high-contrast',
    'Deprecation',
    'Tracking Prevention',
    'Violation',
    'Added non-passive event',
    'Forced reflow',
    'passive to make the page more responsive',
    'connecting...',
    'connected',
    'scheduler.development.js',
    'dynamicCSS.js',
    'blocked access to storage',
    'Download the React DevTools',
    'Warning: Received `true` for a non-boolean attribute',
    'Warning: Instance created by `useForm`',
    'Warning: Can not find FormContext',
    'react-dom.development.js',
    '[vite]',
    'User selected date:',
    'Fetching slots for date:',
    'API Response:',
    'Looking for slots with date parts:',
    'Filtered slots for selected date:',
    'Total slots found:'
  ];

  if (typeof message === 'string' && ignorePatterns.some(pattern => message.includes(pattern))) {
    return;
  }

  if (args && args.length > 0) {
    const stackArg = args.find(arg => 
      typeof arg === 'string' && 
      (arg.includes('react-dom.development.js') || 
       arg.includes('scheduler.development.js') || 
       arg.includes('dynamicCSS.js'))
    );
    
    if (stackArg) return;
  }

  originalConsole.error(message, ...args);
};


console.log = () => {};
console.info = () => {};
console.warn = () => {};
console.debug = () => {};
console.error = filteredError;

if (typeof window !== 'undefined') {
  try {
    window.addEventListener('error', (event) => {
      const errorMsg = event.message || '';
      
      if (errorMsg.includes('-ms-high-contrast') || 
          errorMsg.includes('Tracking Prevention') ||
          errorMsg.includes('Violation') ||
          errorMsg.includes('passive event listener')) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }, true);

    window.addEventListener('unhandledrejection', (event) => {
      const errorMsg = event.reason?.message || String(event.reason);
      
      if (errorMsg.includes('-ms-high-contrast') || 
          errorMsg.includes('Deprecation') ||
          errorMsg.includes('Tracking Prevention') ||
          errorMsg.includes('Violation')) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
  } catch {
    // Silent catch in case browser doesn't support these operations
  }
}

export const enableAllLogs = () => {
  console.log = originalConsole.log;
  console.info = originalConsole.info;
  console.warn = originalConsole.warn;
  console.debug = originalConsole.debug;
  console.error = originalConsole.error;
};

export const disableNonErrorLogs = () => {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.debug = () => {};
  console.error = filteredError;
};

export default {
  enableAllLogs,
  disableNonErrorLogs
};
