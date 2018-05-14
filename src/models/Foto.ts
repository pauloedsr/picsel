import mongoose from "mongoose";

export type FotoModel = mongoose.Document & {
  ensaio: string
  nome: string,
  foto: string,
  selecionado: boolean
};

const fotoSchema = new mongoose.Schema({
  ensaio: { type: mongoose.Schema.Types.ObjectId, ref: "Ensaio" },
  nome: String,
  foto: String,
  selecionado: Boolean
}, { timestamps: true });

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const Foto = mongoose.model<FotoModel>("Foto", fotoSchema);
export default Foto;