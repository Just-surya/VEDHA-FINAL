import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isSupabaseConfigured = Boolean(config.supabaseUrl && config.supabaseKey);

let supabase = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(config.supabaseUrl, config.supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('✅ Supabase client initialized successfully with remote cloud database.');
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
  }
} else {
  console.warn(
    '⚠️ SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured in backend/.env.\n' +
    '   Running with in-memory / local fallback store initialized from db.json.\n' +
    '   To connect your cloud database, set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env.'
  );
}

// Fallback in-memory store initialized from db.json
let localStore = null;

function loadLocalStore() {
  if (localStore) return localStore;
  try {
    const dbPath = path.resolve(__dirname, '../../../db.json');
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf-8');
      localStore = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load local store fallback:', err.message);
  }

  if (!localStore) {
    localStore = {
      students: [],
      attendanceTrend: [],
      termMeta: {
        currentTerm: "Term 2",
        academicYear: "2025-2026",
        previousTerm: {
          totalStudents: 9,
          deltaStudents: "+3 this term",
          avgMarks: 69.9,
          deltaMarks: "+2.1 vs last term",
          avgAttendance: 89.8,
          deltaAttendance: "-0.8 vs last term",
          passRate: 94,
          supportNeeded: "1 need support"
        }
      },
      staff: []
    };
  }
  return localStore;
}

export { supabase, isSupabaseConfigured, loadLocalStore };
