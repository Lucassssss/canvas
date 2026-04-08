import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import killPort from 'kill-port';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

process.on('uncaughtException', (err) => {
  console.error('[API] Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[API] Unhandled Rejection:', reason);
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === 'https://joii.cc' || origin === 'https://www.joii.cc' || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use(router);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API] Error:', err);
  
  const isProd = process.env.NODE_ENV === 'production';
  
  if (res.headersSent) {
    return next(err);
  }
  
  const statusCode = err.statusCode || err.status || 500;
  
  if (isProd) {
    res.status(statusCode).json({ 
      error: statusCode === 500 ? '服务器内部错误' : err.message || '请求失败'
    });
  } else {
    res.status(statusCode).json({ 
      error: err.message || 'Internal server error',
      stack: err.stack
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function startServer(retry = false) {
  return new Promise((resolve) => {
    try {
      const server = app.listen(PORT, () => {
        console.log(`API server running on http://localhost:${PORT}`);
        resolve(server);
      });

      server.on('error', async (error: any) => {
        if (error.code === 'EADDRINUSE' && !retry) {
          console.log(`Port ${PORT} in use, killing process...`);
          try {
            await killPort(PORT, 'tcp');
            await new Promise(r => setTimeout(r, 500));
            server.close();
            await startServer(true);
            resolve(null);
          } catch (e) {
            console.error('[API] Failed to kill port:', e);
            resolve(null);
          }
        } else {
          console.error('[API] Server error:', error.message);
          resolve(null);
        }
      });
    } catch (err: any) {
      console.error('[API] Failed to start server:', err.message);
      resolve(null);
    }
  });
}

startServer().then(() => {
  console.log('[API] Server initialization complete');
});
