import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { generateToken, requireAuth, AuthenticatedRequest } from '../auth';
import { UserRole } from '../../types';

export const authRouter = Router();

// Register new user
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, country = 'Ghana', password, role = 'farmer' } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = (role as UserRole) || 'farmer';

    // Prevent direct self-registration as admin or financial institution without invitation
    const safeRole: UserRole = ['admin', 'financial_institution'].includes(userRole)
      ? 'farmer'
      : userRole;

    const user = db.createUser({
      fullName,
      email,
      phone: phone || '',
      country,
      role: safeRole,
      isVerified: false,
      passwordHash,
    });

    // If farmer, bootstrap empty initial profile
    if (safeRole === 'farmer') {
      db.upsertFarmerProfile({
        userId: user.id,
        fullName: user.fullName,
        phone: user.phone,
        region: 'Bono Region',
      });
    }

    db.addAuditLog({
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      action: 'USER_REGISTERED',
      resourceType: 'User',
      resourceId: user.id,
      details: `New user registration with role ${user.role}`,
    });

    const { passwordHash: _, ...safeUser } = user;
    const token = generateToken(safeUser);

    return res.status(201).json({
      message: 'Account created successfully',
      user: safeUser,
      token,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { passwordHash: _, ...safeUser } = user;
    const token = generateToken(safeUser);

    db.addAuditLog({
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      action: 'USER_LOGIN',
      resourceType: 'Session',
      resourceId: user.id,
      details: 'User authenticated via password credentials',
    });

    return res.json({
      message: 'Login successful',
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Google OAuth session sync (Firebase Auth integration)
authRouter.post('/google-sync', async (req: Request, res: Response) => {
  try {
    const { id, fullName, email, phone, role = 'farmer', avatarUrl } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google authentication' });
    }

    let user = db.findUserByEmail(email);

    if (!user) {
      // First-time Google user registration
      const autoPasswordHash = await bcrypt.hash(`google_oauth_${id || Date.now()}`, 10);
      user = db.createUser({
        fullName: fullName || 'Google User',
        email,
        phone: phone || '+233 24 456 7890',
        country: 'Ghana',
        role: (role as UserRole) || 'farmer',
        isVerified: true,
        avatarUrl,
        passwordHash: autoPasswordHash,
      });

      if (user.role === 'farmer') {
        db.upsertFarmerProfile({
          userId: user.id,
          fullName: user.fullName,
          phone: user.phone,
          region: 'Bono Region',
        });
      }

      db.addAuditLog({
        actorId: user.id,
        actorName: user.fullName,
        actorRole: user.role,
        action: 'USER_REGISTERED',
        resourceType: 'User',
        resourceId: user.id,
        details: 'User registered via Google Authentication (Firebase)',
      });
    }

    const { passwordHash: _, ...safeUser } = user;
    const token = generateToken(safeUser);

    db.addAuditLog({
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      action: 'USER_LOGIN',
      resourceType: 'Session',
      resourceId: user.id,
      details: 'User authenticated via Google Account (Firebase)',
    });

    return res.json({
      message: 'Authenticated successfully with Google',
      user: safeUser,
      token,
    });
  } catch (err: any) {
    console.error('Google sync error:', err);
    return res.status(500).json({ error: 'Failed to synchronize Google authentication session' });
  }
});

// Fast role switcher for testing and demonstration
authRouter.post('/demo-login', (req: Request, res: Response) => {
  const { role } = req.body;
  const demoRoleEmails: Record<string, string> = {
    farmer: 'kwame.mensah@agritrust.gh',
    supplier: 'agro.supplies@agritrust.gh',
    fertilizer_dealer: 'fertilizer.admin@agritrust.gh',
    seed_dealer: 'seed.admin@agritrust.gh',
    equipment_provider: 'volta.tractors@agritrust.gh',
    financial_institution: 'agri.bank@agritrust.gh',
    field_agent: 'agent.kofi@agritrust.gh',
    admin: 'admin@agritrust.gh',
  };

  const targetEmail = demoRoleEmails[role] || demoRoleEmails.farmer;
  const user = db.findUserByEmail(targetEmail);

  if (!user) {
    return res.status(404).json({ error: 'Demo user not found' });
  }

  const { passwordHash: _, ...safeUser } = user;
  const token = generateToken(safeUser);

  return res.json({
    message: `Switched to demo role: ${role}`,
    user: safeUser,
    token,
  });
});

// Get current user profile
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const profile = req.user.role === 'farmer' ? db.getFarmerProfile(req.user.id) : null;
  const notifications = db.getNotifications(req.user.id);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return res.json({
    user: req.user,
    profile,
    unreadNotificationsCount,
  });
});
