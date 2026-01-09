const corsOptions = {
    origin: (origin, callback) => {
        // Cho phép các domain trong whitelist hoặc không có origin (như Postman/Server-to-Server)
        const whitelist = [
            'http://localhost:3000', // Frontend React
            'http://localhost:3001', // Frontend React (fallback port)
            'http://localhost:5173', // Vite React (nếu dùng Vite)
            'http://127.0.0.1:3000'
        ];

        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Cho phép gửi cookies/session headers
    optionsSuccessStatus: 200
};

module.exports = corsOptions;