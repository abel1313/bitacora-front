import Swal, { SweetAlertCustomClass, SweetAlertIcon, SweetAlertOptions } from "sweetalert2"
import { IMensajePersonalizado } from "../home/bitacora/generar-bitacora/models";



export interface ICssButton {
    confirmButton: string
    cancelButton: string
}
export interface IMensajeMostrarSwal {
    title: string;
    html: string;
    icon: SweetAlertIcon;
}
export class MensajeSwal {


    public static mensajeResult(opciones: IMensajePersonalizado ): Promise<boolean> {
        return new Promise((resolve, rejeact) => {

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: opciones.css,
                buttonsStyling: false
            })

            swalWithBootstrapButtons.fire(opciones.options).then((result) => {
                if (result.isConfirmed) {
                    swalWithBootstrapButtons.fire(opciones.mensajeSuccess);
                    resolve(true);
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire(opciones.mensajeError);
                    rejeact(false);
                }
            });
        });
    }
}