import { Request } from 'express';

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface RequestWithUser extends Request {
  user?: IUser;
}

export interface DataStoredInToken {
  id: string;
}
