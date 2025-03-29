import { UserRole } from '../enums/user-roles.enum';

export const userSeed = [
  {
    name: 'admin',
    password: 'admin',
    email: 'email@jonathanleivag.cl',
    role: UserRole.ADMIN,
  },
];
