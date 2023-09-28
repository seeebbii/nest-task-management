import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) { }


    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return await this.userRepository.signUp(authCredentialsDto);
    }

    async sigIn(authCredentialsDtoL: AuthCredentialsDto): Promise< {accessToken: string } > {
        const username = await this.userRepository.validateUserPassword(authCredentialsDtoL);
        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }
        // Create the payload for the JWT token
        const payload: JwtPayloadInterface= { username };
        const accessToken = this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
        
        return { accessToken };
    }
}
