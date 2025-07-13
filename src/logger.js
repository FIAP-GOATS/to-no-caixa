import fs from 'fs';
import path from 'path';

export class Logger {
  static logFilePath = path.resolve('logs', 'app.log');

  static ensureLogFile() {
    const dir = path.dirname(this.logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.logFilePath)) {
      fs.writeFileSync(this.logFilePath, '');
    }
  }

  static formatMessage(type, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${type.toUpperCase()}] ${message}`;
  }

  static getColor(type) {
    switch (type.toLowerCase()) {
      case 'info':
        return '\x1b[32m'; // verde
      case 'warn':
        return '\x1b[33m'; // amarelo
      case 'error':
        return '\x1b[31m'; // vermelho
      default:
        return '\x1b[0m';  // reset
    }
  }

  static write(type, message) {
    this.ensureLogFile();
    const formattedMessage = this.formatMessage(type, message);

    fs.appendFileSync(this.logFilePath, formattedMessage + '\n');

    const color = this.getColor(type);
    console.log(`${color}${formattedMessage}\x1b[0m`);
  }

  static info(message) {
    this.write('info', message);
  }

  static warn(message) {
    this.write('warn', message);
  }

  static error(message) {
    this.write('error', message);
  }
}
