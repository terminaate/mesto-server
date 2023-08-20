import { UserDocument } from '../../users/models/user.model';

export function isSelfUser(user: UserDocument, ident?: string): boolean {
  return ident === '@me' || user.id === ident || user.username === ident;
}
