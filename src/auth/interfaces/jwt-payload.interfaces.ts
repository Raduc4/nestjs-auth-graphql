export interface JwtPayload {
  email: string;
  _id: string;
  expiration?: Date;
}
