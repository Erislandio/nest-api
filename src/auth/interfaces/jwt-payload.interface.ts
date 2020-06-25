export interface JwtPayload {
    email: string;
}

export interface JwtResponse {
    expiresIn: number;
    token: string;
}