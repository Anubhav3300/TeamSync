
const USERS_STORAGE_KEY = 'teamsync_registered_users';
const CURRENT_USER_KEY = 'teamsync_active_session';

export const DEFAULT_USERS = [
  {
    id: 'usr-1',
    name: 'Rohan Verma',
    email: 'rohan.v@teamsync.io',
    password: 'password123',
    role: 'Project Manager',
    systemRole: 'Admin',
    department: 'Product',
    initials: 'RV',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    name: 'David Kim',
    email: 'david.k@teamsync.io',
    password: 'password123',
    role: 'Lead Developer',
    systemRole: 'Developer',
    department: 'Engineering',
    initials: 'DK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-3',
    name: 'Elena Rostova',
    email: 'elena.r@teamsync.io',
    password: 'password123',
    role: 'UX Designer',
    systemRole: 'Designer',
    department: 'Design',
    initials: 'ER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-4',
    name: 'Maria Santos',
    email: 'maria.s@teamsync.io',
    password: 'password123',
    role: 'QA Tester',
    systemRole: 'Developer',
    department: 'Quality Assurance',
    initials: 'MS',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  }
];

export function getRegisteredUsers() {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    let users = [];
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        users = parsed;
      }
    }

    const cleanUsers = users.filter(u => u.email.toLowerCase() !== 'sarah.j@teamsync.io');

    DEFAULT_USERS.forEach(defaultUser => {
      const index = cleanUsers.findIndex(
        u => u.id === defaultUser.id || u.email.toLowerCase() === defaultUser.email.toLowerCase()
      );
      if (index >= 0) {
        cleanUsers[index] = { ...cleanUsers[index], ...defaultUser };
      } else {
        cleanUsers.unshift(defaultUser);
      }
    });

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(cleanUsers));
    return cleanUsers;
  } catch (e) {
    return DEFAULT_USERS;
  }
}

export function registerUser({ name, email, password, role = 'Project Manager' }) {
  if (!name || !name.trim()) {
    return { success: false, error: 'Please enter your full name.' };
  }
  if (!email || !email.trim()) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { success: false, error: 'Please enter a valid email format (e.g., name@company.com).' };
  }
  if (!password || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters long.' };
  }

  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
  }

  let systemRole = 'Developer';
  if (role.toLowerCase().includes('manager') || role.toLowerCase().includes('admin')) {
    systemRole = 'Admin';
  } else if (role.toLowerCase().includes('designer')) {
    systemRole = 'Designer';
  }

  const nameParts = name.trim().split(' ');
  const initials = nameParts.map(p => p[0]).slice(0, 2).join('').toUpperCase() || 'U';

  const newUser = {
    id: 'usr-' + Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    password: password,
    role: role,
    systemRole: systemRole,
    department: role.includes('Designer') ? 'Design' : role.includes('Manager') ? 'Product' : 'Engineering',
    initials: initials,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=4f46e5,3b82f6,10b981`
  };

  const updatedUsers = [...users, newUser];
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  } catch (e) {
    console.error('Error saving new user:', e);
  }

  return { success: true, user: newUser };
}

export function authenticateUser(email, password) {
  if (!email || !email.trim()) {
    return { success: false, error: 'Please enter your email address.' };
  }
  if (!password) {
    return { success: false, error: 'Please enter your password.' };
  }

  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  let user = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    user = DEFAULT_USERS.find(u => u.email.toLowerCase() === normalizedEmail);
  }

  if (!user) {
    return {
      success: false,
      error: 'No account found with this email. Please check your spelling or sign up for a new account.'
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please try again or use the demo login buttons below.'
    };
  }

  return { success: true, user };
}

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredSession(user) {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (e) {
    console.error('Failed to clear session:', e);
  }
}
