import { IUsuarioDto } from "src/app/home/acceso/models";




export interface IGuardar {
    colaborador: string;
    fecha: string;
    hora: string;
    notas: string;
    actividad: string;
    cr: number;
    usuario: IUsuarioDto;
}