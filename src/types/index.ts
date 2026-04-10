export type UserRole = 'junior' | 'senior' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  joinDate: string;
}

export interface NavItem {
  label: string;
  icon: string;
  href?: string;
  subItems?: NavItem[];
  adminOnly?: boolean;
}
