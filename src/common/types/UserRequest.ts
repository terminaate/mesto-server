import { Request } from 'express';
import { UserDocument } from '../../users/models/user.model';

export type UserRequest = Request & { user: UserDocument };
