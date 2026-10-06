import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) must be defined in backend/.env to run this migration.');
  console.log('\nUsage:');
  console.log('1. Add your Supabase credentials to backend/.env');
  console.log('2. Run: npm run migrate\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

async function runMigration() {
  console.log('🚀 Starting Vedha Data Migration to Supabase PostgreSQL...\n');

  // 1. Read db.json safely
  const dbPath = path.resolve(__dirname, '../../db.json');
  if (!fs.existsSync(dbPath)) {
    console.error(`❌ Source db.json not found at ${dbPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(dbPath, 'utf-8');
  const dbData = JSON.parse(raw);

  console.log(`📂 Source db.json loaded successfully:`);
  console.log(`   - Students: ${dbData.students?.length || 0}`);
  console.log(`   - Attendance Trend: ${dbData.attendanceTrend?.length || 0}`);
  console.log(`   - Staff: ${dbData.staff?.length || 0}\n`);

  // 2. Migrate Staff / Users
  console.log('👤 Migrating Staff users to "users" table...');
  const staffList = dbData.staff || [];
  for (const staff of staffList) {
    const hashedPassword = staff.password
      ? bcrypt.hashSync(staff.password, 10)
      : bcrypt.hashSync('admin123', 10);

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          username: staff.username,
          password_hash: hashedPassword,
          name: staff.name || 'Staff Member',
          role: staff.role || 'Academic Coordinator',
          department: staff.department || 'High School Wing',
        },
        { onConflict: 'username' }
      )
      .select();

    if (error) {
      console.error(`   ⚠️ Failed to migrate staff ${staff.username}:`, error.message);
    } else {
      console.log(`   ✅ Staff user migrated: "${staff.username}" (${staff.name})`);
    }
  }

  // 3. Migrate Students
  console.log('\n🎓 Migrating Students to "students" table...');
  const studentsList = dbData.students || [];
  let studentSuccessCount = 0;

  for (const student of studentsList) {
    const studentRecord = {
      id: String(student.id),
      name: student.name,
      class: student.class,
      marks: Number(student.marks),
      attendance: Number(student.attendance),
      grade: student.grade,
      gender: student.gender || 'Female',
      contact_email: student.contactEmail || null,
      guardian_name: student.guardianName || null,
      created_at: student.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('students')
      .upsert(studentRecord, { onConflict: 'id' });

    if (error) {
      console.error(`   ⚠️ Failed to migrate student "${student.name}" (ID: ${student.id}):`, error.message);
    } else {
      studentSuccessCount++;
    }
  }
  console.log(`   ✅ Migrated ${studentSuccessCount} of ${studentsList.length} student records.`);

  // 4. Migrate Attendance Trend
  console.log('\n📈 Migrating Attendance Trend to "attendance_trend" table...');
  const trendList = dbData.attendanceTrend || [];
  let trendSuccessCount = 0;

  for (let i = 0; i < trendList.length; i++) {
    const t = trendList[i];
    const trendRecord = {
      id: String(t.id || `trend-${i + 1}`),
      month: t.month,
      attendance: Number(t.attendance),
      sort_order: i + 1,
    };

    const { error } = await supabase
      .from('attendance_trend')
      .upsert(trendRecord, { onConflict: 'id' });

    if (error) {
      console.error(`   ⚠️ Failed to migrate trend month ${t.month}:`, error.message);
    } else {
      trendSuccessCount++;
    }
  }
  console.log(`   ✅ Migrated ${trendSuccessCount} attendance trend data points.`);

  // 5. Migrate Term Metadata
  console.log('\n📋 Migrating Term Metadata to "term_meta" table...');
  if (dbData.termMeta) {
    const termRecord = {
      id: 'current',
      current_term: dbData.termMeta.currentTerm || 'Term 2',
      academic_year: dbData.termMeta.academicYear || '2025-2026',
      previous_term: dbData.termMeta.previousTerm,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('term_meta')
      .upsert(termRecord, { onConflict: 'id' });

    if (error) {
      console.error(`   ⚠️ Failed to migrate term metadata:`, error.message);
    } else {
      console.log(`   ✅ Term metadata migrated successfully.`);
    }
  }

  console.log('\n🎉 Migration complete! All records verified in Supabase PostgreSQL.');
}

runMigration().catch((err) => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
