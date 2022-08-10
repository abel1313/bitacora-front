import { ICssButton, IMensajeMostrarSwal } from "src/app/models/mensaje.mode";
import { SweetAlertOptions } from "sweetalert2";



export interface IMensajePersonalizado{
    css: ICssButton;
    options: SweetAlertOptions;
    mensajeSuccess: IMensajeMostrarSwal;
    mensajeError: IMensajeMostrarSwal;
}
export class MensajesPersonalizados{

    public mensajePerso(): IMensajePersonalizado{
        return{
         css: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
           options: {
            title: '¿Esta seguro de seguir?',
            text: "Esta información ya no podrá ser editada",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
          },
           mensajeSuccess: {
            title: "Se registró correctamente",
            html: "",
            icon: 'success'
          },
           mensajeError: {
            title: "Esta acción se canceló",
            html: "Cancelado",
            icon: 'error'
          }
        }
    }
}