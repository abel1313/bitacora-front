import { AbstractControl, ValidationErrors } from "@angular/forms";
import Swal from "sweetalert2";



export class ValidatorsForm{

    public static validarActividad(control: AbstractControl): ValidationErrors | null{
        return control.value != 0 ? null : { actividadInvalida: true} ;
    }
    public static validarCr(control: AbstractControl): ValidationErrors | null{
        return control.value != 0 ? null : { crInvalida: true} ;
    }

    public static validarFecha(control: AbstractControl): ValidationErrors | null{
        const fecha = new Date(control.value);
        if( fecha.getDay() > 5){
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Ingrese un dia de Lunes a Viernes',
                showConfirmButton: false,
                timer: 1500
              });
        }
        return fecha.getDay() < 5 ? null : { fechaInvalida: true} ;
    }

    public static validarHora(control: AbstractControl): ValidationErrors | null{
        const hora = control.value;
        if(  hora > 8){
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'No puedes ingresar más de 8 horas diarias',
                showConfirmButton: false,
                timer: 1500
              });
        }
        return hora > 0 && hora < 9 ? null : { horaInvalida: true} ;
    }
}