import app from './app.js';
import { config } from './config/env.js';
import { isSupabaseConfigured } from './config/db.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Vedha REST API server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🗄️ Database: ${isSupabaseConfigured ? 'Supabase PostgreSQL Cloud' : 'Local Fallback Store'}`);
  console.log(`🌐 Allowed Frontend: ${config.frontendUrl}`);
  console.log(`====================================================`);
});
