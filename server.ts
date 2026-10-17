import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { authRouter } from './src/server/routes/auth';
import { farmersRouter } from './src/server/routes/farmers';
import { farmsRouter } from './src/server/routes/farms';
import { marketplaceRouter } from './src/server/routes/marketplace';
import { loansRouter } from './src/server/routes/loans';
import { equipmentRouter } from './src/server/routes/equipment';
import { aiRouter } from './src/server/routes/ai';
import { adminRouter } from './src/server/routes/admin';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve API routes
app.use('/api/auth', authRouter);
app.use('/api/farmers', farmersRouter);
app.use('/api/farms', farmsRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/loans', loansRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/ai', aiRouter);
app.use('/api/admin', adminRouter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    app: 'AgriTrust AI',
    timestamp: new Date().toISOString(),
    environment: isProduction ? 'production' : 'development',
  });
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 AgriTrust AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start AgriTrust AI server:', err);
  process.exit(1);
});
