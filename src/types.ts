export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  passwordHash?: string;
}

export interface Terminal {
  id: number;
  name: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  description: string;
}

export type TransportType = 'Jeepney' | 'Bus' | 'UV Express' | 'Modern Jeepney';

export interface RouteStop {
  id: number;
  name: string;
  sequence: number;
}

export interface TimelineStep {
  stepNumber: number;
  icon: string;
  titleEn: string;
  titleFil: string;
  instructionEn: string;
  instructionFil: string;
  meta: string;
}

export interface Route {
  id: number;
  terminalId: number;
  name: string;
  origin: string;
  destination: string;
  transportType: TransportType;
  fare: number;
  estimatedTravelTime: number; // in minutes
  description: string;
  transfers?: number;
  walkingDistanceMeters?: number;
  stops?: string[];
  timeline?: TimelineStep[];
}

export interface SavedRoute {
  id: number;
  userId: number;
  routeId: number;
  route: Route;
  savedAt: string;
}

export type PhraseCategory = 'Directions' | 'Transportation' | 'Fare' | 'Getting Off' | 'Courtesy';

export interface CommuterPhrase {
  id: number;
  category: PhraseCategory;
  english: string;
  filipino: string;
  bikol: string;
  context: string;
}
