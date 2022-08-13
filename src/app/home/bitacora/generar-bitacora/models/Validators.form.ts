import { AbstractControl, ValidationErrors, Validators } from "@angular/forms";
import Swal from "sweetalert2";



export class ValidatorsForm{


    public static validarActividad(control: AbstractControl): ValidationErrors | null{
        return control.value != 0 ? null : { actividadInvalida: true} ;
    }
    public static validarCorreo(control: AbstractControl): ValidationErrors | null{

        const coreoValid = '^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,3}';
        const tieneArroa = '[@]';
        const regArroba = RegExp(tieneArroa);
        const reg = RegExp(coreoValid);
        if( regArroba.test(control.value) ){
                return  !reg.test(control.value) ?  { correoInvalido: true}: null;
            
        }
        return !reg.test(control.value) ? null : { correoInvalido: true} ;
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

        console.log(control.value, " Vlaueeeeee ");
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

export const validarNotas: ValidationErrors = (control: AbstractControl): ValidationErrors | null =>{
    const validarNota = control.get('tituloCr').value;
    const validarcr = control.get('cr').value;
    const valueNota = control.get('notas').value;
    let valid = false;
console.log(control);
    
    if( validarNota!== null ){
        valid = (  validarNota.idAsig === 1 && valueNota !== ''  ) ||  
        (  validarNota.idCr === 1 && valueNota !== ''  ) || (validarNota.idAsig !== 1 && validarNota.idCr !== 1) ; 
    }


    return ( valid ) ? null : { notaRequerida: true} ;
}