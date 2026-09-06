export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  ACCESS = 'ACCESS'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: unknown;
}

const LOG_STORAGE_KEY = 'kmci_system_logs';
const MAX_LOGS = 1000;

export class Logger {
  private static getLogs(): LogEntry[] {
    try {
      const logs = localStorage.getItem(LOG_STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  private static saveLog(entry: LogEntry) {
    try {
      const logs = this.getLogs();
      logs.unshift(entry); // Add to beginning
      if (logs.length > MAX_LOGS) {
        logs.pop(); // Remove oldest
      }
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save log', e);
    }
  }

  static log(level: LogLevel, message: string, details?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      details
    };

    // Console output
    const style = {
      [LogLevel.INFO]: 'color: #3b82f6',
      [LogLevel.WARN]: 'color: #eab308',
      [LogLevel.ERROR]: 'color: #ef4444',
      [LogLevel.ACCESS]: 'color: #22c55e'
    };
    
    console.log(`%c[${level}] ${message}`, style[level] || '', details);
    
    // Persist log
    this.saveLog(entry);
  }

  static info(message: string, details?: unknown) {
    this.log(LogLevel.INFO, message, details);
  }

  static warn(message: string, details?: unknown) {
    this.log(LogLevel.WARN, message, details);
  }

  static error(message: string, details?: unknown) {
    this.log(LogLevel.ERROR, message, details);
  }

  static access(message: string, details?: unknown) {
    this.log(LogLevel.ACCESS, message, details);
  }

  static getHistory(): LogEntry[] {
    return this.getLogs();
  }

  static clearHistory() {
    localStorage.removeItem(LOG_STORAGE_KEY);
  }
}
