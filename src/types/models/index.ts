// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  DRIVER = 'DRIVER',
  USER = 'USER',
}

export enum UserState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum LocationType {
  COUNTRY = 'COUNTRY',
  STATE = 'STATE',
  CITY = 'CITY',
  DISTRICT = 'DISTRICT',
  NEIGHBORHOOD = 'NEIGHBORHOOD',
}

// Entities
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  state: UserState;
  createdAt?: string;
  updatedAt?: string;
}
export interface Company {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  locationId?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface Route {
  id: string;
  name: string;
  companyId: string;
  stopIds: string[];
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface Schedule {
  id: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  daysOfWeek: DayOfWeek[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  locationId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Location {
  id: string;
  name: string;
  type: LocationType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTOs
export interface LoginDto {
  email: string;
  password: string;
}
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}
export interface AuthResponseDto {
  access_token: string;
  user: User;
}

// Responses
export type UserResponseDto = User;
export type RouteResponseDto = Route;
export type ScheduleResponseDto = Schedule;
export type CompanyResponseDto = Company;
export type StopResponseDto = Stop;
