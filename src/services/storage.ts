import { User, Terminal, Route, SavedRoute } from '../types';
import { INITIAL_USERS, INITIAL_TERMINALS, INITIAL_ROUTES } from '../data/seedData';

const KEY_USERS = 'transitph_users';
const KEY_SESSION = 'transitph_session_user';
const KEY_TERMINALS = 'transitph_terminals';
const KEY_ROUTES = 'transitph_routes';
const KEY_SAVED_ROUTES = 'transitph_saved_routes';
const KEY_LANG = 'transitph_language';

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(KEY_USERS);
    if (!raw) {
      localStorage.setItem(KEY_USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUser(user: Omit<User, 'id'>): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (existing) {
    return { success: false, error: 'An account with this email address already exists.' };
  }
  const newUser: User = {
    ...user,
    id: Date.now(),
  };
  users.push(newUser);
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
  return { success: true, user: newUser };
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(KEY_SESSION);
    if (!raw) {
      // Default to Maria Santos for convenience, or null if logged out
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(KEY_SESSION, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEY_SESSION);
  }
}

export function getTerminals(): Terminal[] {
  try {
    const raw = localStorage.getItem(KEY_TERMINALS);
    if (!raw) {
      localStorage.setItem(KEY_TERMINALS, JSON.stringify(INITIAL_TERMINALS));
      return INITIAL_TERMINALS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TERMINALS;
  }
}

export function saveTerminal(terminal: Omit<Terminal, 'id'> & { id?: number }): Terminal {
  const list = getTerminals();
  if (terminal.id) {
    // Edit
    const index = list.findIndex((t) => t.id === terminal.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...terminal } as Terminal;
      localStorage.setItem(KEY_TERMINALS, JSON.stringify(list));
      return list[index];
    }
  }
  // Create
  const newTerm: Terminal = {
    ...terminal,
    id: Date.now(),
  };
  list.unshift(newTerm);
  localStorage.setItem(KEY_TERMINALS, JSON.stringify(list));
  return newTerm;
}

export function deleteTerminal(id: number): void {
  const list = getTerminals().filter((t) => t.id !== id);
  localStorage.setItem(KEY_TERMINALS, JSON.stringify(list));

  // Also remove routes associated with this terminal
  const routes = getRoutes().filter((r) => r.terminalId !== id);
  localStorage.setItem(KEY_ROUTES, JSON.stringify(routes));
}

export function getRoutes(): Route[] {
  try {
    const raw = localStorage.getItem(KEY_ROUTES);
    if (!raw) {
      localStorage.setItem(KEY_ROUTES, JSON.stringify(INITIAL_ROUTES));
      return INITIAL_ROUTES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ROUTES;
  }
}

export function saveRoute(route: Omit<Route, 'id'> & { id?: number }): Route {
  const list = getRoutes();
  if (route.id) {
    const index = list.findIndex((r) => r.id === route.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...route } as Route;
      localStorage.setItem(KEY_ROUTES, JSON.stringify(list));
      return list[index];
    }
  }
  const newRoute: Route = {
    ...route,
    id: Date.now(),
  };
  list.unshift(newRoute);
  localStorage.setItem(KEY_ROUTES, JSON.stringify(list));
  return newRoute;
}

export function deleteRoute(id: number): void {
  const list = getRoutes().filter((r) => r.id !== id);
  localStorage.setItem(KEY_ROUTES, JSON.stringify(list));

  // Also remove from saved routes
  const saved = getSavedRoutes().filter((s) => s.routeId !== id);
  localStorage.setItem(KEY_SAVED_ROUTES, JSON.stringify(saved));
}

export function getSavedRoutes(userId?: number): SavedRoute[] {
  try {
    const raw = localStorage.getItem(KEY_SAVED_ROUTES);
    const list: SavedRoute[] = raw ? JSON.parse(raw) : [];
    if (userId) {
      return list.filter((item) => item.userId === userId);
    }
    return list;
  } catch {
    return [];
  }
}

export function addSavedRoute(userId: number, route: Route): { success: boolean; error?: string } {
  const list = getSavedRoutes();
  const existing = list.find((s) => s.userId === userId && s.routeId === route.id);
  if (existing) {
    return { success: false, error: 'This route is already in your saved list.' };
  }
  const newSaved: SavedRoute = {
    id: Date.now(),
    userId,
    routeId: route.id,
    route,
    savedAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
  list.unshift(newSaved);
  localStorage.setItem(KEY_SAVED_ROUTES, JSON.stringify(list));
  return { success: true };
}

export function removeSavedRoute(savedId: number): void {
  const list = getSavedRoutes().filter((s) => s.id !== savedId);
  localStorage.setItem(KEY_SAVED_ROUTES, JSON.stringify(list));
}

export function isRouteSaved(userId: number, routeId: number): boolean {
  const list = getSavedRoutes();
  return list.some((s) => s.userId === userId && s.routeId === routeId);
}

export function getPreferredLanguage(): 'en' | 'fil' | 'bikol' {
  return (localStorage.getItem(KEY_LANG) as 'en' | 'fil' | 'bikol') || 'en';
}

export function setPreferredLanguage(lang: 'en' | 'fil' | 'bikol'): void {
  localStorage.setItem(KEY_LANG, lang);
}
