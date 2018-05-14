import { FotoModel } from "./Foto";
import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose from "mongoose";


export type EnsaioModel = mongoose.Document & {
  chave: String,
  nome: String,
};

const ensaioSchema = new mongoose.Schema({
  chave: String,
  nome: String,
}, { timestamps: true });

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const Ensaio = mongoose.model<EnsaioModel>("Ensaio", ensaioSchema);
export default Ensaio;