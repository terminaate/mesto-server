import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export type UserRequest = Request & { user: { id: string } }

@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') {
}

export default JwtAuthGuard;