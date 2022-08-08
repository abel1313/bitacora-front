



export class RemoverSesion{

    public static removerSesion(session: string): void{
        sessionStorage.removeItem(session);
    }
}