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
  location?: Location;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Route {
  id: string;
  name: string;
  companyId: string;
  company?: Company;
  stopIds: string[];
  stops?: Stop[];
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Schedule {
  id: string;
  routeId: string;
  route?: Route;
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
  location?: Location;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Location {
  id: string;
  city: string;
  state: string;
  country: string;
  createdAt?: string;
  updatedAt?: string;
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

// DTOs DE CREACIÓN (Create)
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  state?: UserState;
}

export interface CreateCompanyDto {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  locationId?: string;
  isActive?: boolean;
}

export interface CreateRouteDto {
  name: string;
  companyId: string;
  stopIds: string[];
  description?: string;
  isActive?: boolean;
}

export interface CreateScheduleDto {
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  daysOfWeek: DayOfWeek[];
  isActive?: boolean;
}

export interface CreateStopDto {
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  locationId?: string;
  isActive?: boolean;
}

export interface CreateLocationDto {
  city: string;
  state: string;
  country: string;
}

// DTOs DE ACTUALIZACIÓN (Update)
export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: UserRole;
  state?: UserState;
}

export interface UpdateCompanyDto {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  locationId?: string;
  isActive?: boolean;
}

export interface UpdateRouteDto {
  name?: string;
  companyId?: string;
  stopIds?: string[];
  description?: string;
  isActive?: boolean;
}

export interface UpdateScheduleDto {
  routeId?: string;
  departureTime?: string;
  arrivalTime?: string;
  daysOfWeek?: DayOfWeek[];
  isActive?: boolean;
}

export interface UpdateStopDto {
  name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  locationId?: string;
  isActive?: boolean;
}

export interface UpdateLocationDto {
  city?: string;
  state?: string;
  country?: string;
}

// Responses
export type UserResponseDto = User;
export type CompanyResponseDto = Company;
export type RouteResponseDto = Route;
export type ScheduleResponseDto = Schedule;
export type StopResponseDto = Stop;
export type LocationResponseDto = Location;

// TIPOS DE FILTROS Y BÚSQUEDA
export interface UserFilters {
  role?: UserRole;
  state?: UserState;
  email?: string;
}

export interface CompanyFilters {
  locationId?: string;
  isActive?: boolean;
  name?: string;
}

export interface RouteFilters {
  companyId?: string;
  isActive?: boolean;
  stopId?: string;
}

export interface ScheduleFilters {
  routeId?: string;
  day?: DayOfWeek;
  stopId?: string;
  isActive?: boolean;
}

export interface StopFilters {
  locationId?: string;
  isActive?: boolean;
  name?: string;
}

// TIPOS DE PAGINACIÓN 
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// TIPOS DE VALIDACIÓN (Helpers)
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  validationErrors?: ValidationError[];
}