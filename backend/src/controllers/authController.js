import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, isSupabaseConfigured, loadLocalStore } from '../config/db.js';
import { config } from '../config/env.js';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    const trimmedUsername = username.trim();
    let user = null;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', trimmedUsername)
        .maybeSingle();

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }
      user = data;
    } else {
      const store = loadLocalStore();
      const staffList = store.staff || [];
      const found = staffList.find(s => s.username === trimmedUsername);
      if (found) {
        user = {
          id: found.id,
          username: found.username,
          name: found.name,
          role: found.role,
          department: found.department,
          password_hash: found.password_hash || (found.password === 'admin123' ? bcrypt.hashSync('admin123', 10) : null),
        };
      }
    }

    // Fallback for default demo admin if not yet present in database
    if (!user && trimmedUsername === 'admin' && password === 'admin123') {
      user = {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        username: 'admin',
        name: 'Staff Administrator',
        role: 'Academic Coordinator',
        department: 'High School Wing',
        password_hash: bcrypt.hashSync('admin123', 10),
      };
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    // Verify password with bcrypt
    const passwordValid = bcrypt.compareSync(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const { username, password, name, role, department } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, and full name are required.',
      });
    }

    const trimmedUsername = username.trim().toLowerCase();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      username: trimmedUsername,
      password_hash: hashedPassword,
      name: name.trim(),
      role: role || 'Academic Coordinator',
      department: department || 'High School Wing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let createdUser = null;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({
            success: false,
            message: 'A staff member with this username already exists.',
          });
        }
        throw new Error(`Supabase error: ${error.message}`);
      }
      createdUser = data;
    } else {
      const store = loadLocalStore();
      store.staff = store.staff || [];
      if (store.staff.some(s => s.username === trimmedUsername)) {
        return res.status(409).json({
          success: false,
          message: 'A staff member with this username already exists.',
        });
      }
      const localRecord = { ...newUser, id: String(Date.now()) };
      store.staff.push(localRecord);
      createdUser = localRecord;
    }

    const token = generateToken(createdUser);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: createdUser.id,
        username: createdUser.username,
        name: createdUser.name,
        role: createdUser.role,
        department: createdUser.department,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, name, role, department, created_at')
        .eq('id', req.user.id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (data) return res.json({ success: true, user: data });
    }

    return res.json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        name: req.user.name,
        role: req.user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Backward compatibility endpoint for legacy GET /staff
export async function getStaffList(req, res, next) {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, name, role, department');

      if (error) throw new Error(error.message);
      return res.json(data);
    }

    const store = loadLocalStore();
    return res.json(store.staff || []);
  } catch (err) {
    next(err);
  }
}
