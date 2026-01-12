const corsOptions = {
    origin: (origin, callback) => {
        // Cho phép các domain trong whitelist hoặc không có origin (như Postman/Server-to-Server)
        const whitelist = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'https://trailsexplorer.vercel.app', // Explicitly allow the deployed frontend
            process.env.CLIENT_URL
        ].filter(Boolean).map(url => url.replace(/\/$/, '')); // Remove trailing slashes

        const requestOrigin = origin ? origin.replace(/\/$/, '') : null;

        if (!requestOrigin || whitelist.includes(requestOrigin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Cho phép gửi cookies/session headers
    optionsSuccessStatus: 200
};

module.exports = corsOptions;