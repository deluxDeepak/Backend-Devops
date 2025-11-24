// Logger and monitoring config ===========

// Basic configuration 
const { format, createLogger, transports } = require("winston"); // Fixed: removed 'transport'
require("winston-daily-rotate-file");

// Custom log format 
const logFormat = format.combine( // Fixed: renamed from logFormate
    format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.printf(info => `${info.timestamp} [${info.level}] : ${info.message}`)
);

const logger = createLogger({
    level: "info",
    format: logFormat, // Fixed: renamed from logFormate
    transports: [
        // Console logs colored 
        new transports.Console({
            format: format.combine(
                format.colorize(),
                logFormat // Fixed: renamed from logFormate
            )
        }),

        // Daily log rotation (Info log):INFO logs
        new transports.DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
            level: 'info'
        }),

        // Error logs daily rotation:ERROR logs 
        new transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d',
            maxSize: '20m',
            level: 'error'
        })
    ],

    // Exception Handlers 
    exceptionHandlers: [
        new transports.File({
            filename: "logs/exceptions.log"
        }),
        new transports.Console({
            format: format.combine( // Fixed: removed format.Console()
                format.colorize(),
                logFormat // Fixed: renamed from logFormate
            )
        })
    ],

    rejectionHandlers: [
        new transports.File({
            filename: "logs/rejections.log"
        }),
        new transports.Console({
            format: format.combine(
                format.colorize(),
                logFormat // Fixed: renamed from logFormate
            )
        })
    ]
});

module.exports = logger;

