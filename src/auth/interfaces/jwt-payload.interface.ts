export interface JwtPayload {
    email: string;
}

export interface JwtResponse {
    expiresIn: number | string;
    token: string;
}