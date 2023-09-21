import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JwtPayloadInterface } from "./jwt-payload.interface";
import { UserRepository } from "./user.repository";
import { UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,

    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'topSecret51',
        });
    }

    async validate(payload: JwtPayloadInterface){
        const user = await this.userRepository.findOne({where: {username: payload.username}}); 
        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }
}

