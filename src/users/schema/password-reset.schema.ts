import { Schema } from 'mongoose';
export const PasswordResetSchema: Schema = new Schema({
  token: { type: String, required: true },
  expiration: { type: Date, required: true },
});
