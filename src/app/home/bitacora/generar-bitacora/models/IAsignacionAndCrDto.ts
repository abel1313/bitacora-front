



export interface IAsignacionAndCrDto{

    idCr: number;
    crDTO: ICrDTOAsig;
    asignacionesDTO:IAsignacionesDTO;

}

export interface ICrDTOAsig{
    idCr: number;
    nombreCrNombreAsignacion: string;
    folioAsignacion: string;
}

export interface IAsignacionesDTO{
    id: number;
    nombreAsignacion: string;
    numeroAsignacion: string;
}

export interface ICrDTOAsigMap{
    id: number;
    idCr: number;
    nombreCrNombreAsignacion: string;
    idAsig: number;
}

export interface ICrDTOAsignacionMap{
    id: number;
    idAsig: number;
    idCr: number;
    nombreAsignacion: string;
    numeroAsignacion: string;
}

