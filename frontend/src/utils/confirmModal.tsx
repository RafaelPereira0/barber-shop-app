import Swal from "sweetalert2";

interface ConfirmModalProps {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
}

/**
 * Dispara um modal de confirmação elegante e personalizado com a identidade do BarberApp.
 * Retorna uma Promise que resolve em `true` se o usuário confirmou, ou `false` se cancelou.
 */
export async function showConfirmModal({
    title = "Tem certeza?",
    text = "Esta ação não poderá ser desfeita!",
    confirmButtonText = "Sim, remover",
    cancelButtonText = "Cancelar",
}: ConfirmModalProps = {}): Promise<boolean> {

    const result = await Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor: "#ff9000",
        cancelButtonColor: "#e53e3e",
        background: "#202024",
        color: "#ffffff",

        customClass: {
            popup: 'barber-swal-popup',
            title: 'barber-swal-title',
            htmlContainer: 'barber-swal-text',
        },

        buttonsStyling: true,
        reverseButtons: true,
    });

    return result.isConfirmed;
}