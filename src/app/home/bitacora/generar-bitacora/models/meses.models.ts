
export interface IMesesDTO{
    index: number;
    nombreMes: string;
    diasMes: number;
}

export interface IMostrarReporte{
    mostrarBoton: boolean;
    mesesDto: Array<IMesesDTO>;
}