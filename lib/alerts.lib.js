/********************************************************************
 **                          Nebula Alerts                         **
 *? SweetAlert2 wrapper to handle toasts, alerts and confirmations  *
 *!  This is currently WIP and documentation is subject to change   *
 **                       Tristan Gauci, 2022                       *
*********************************************************************/

// Import SweetAlert2
import 'https://cdn.jsdelivr.net/npm/sweetalert2@11.4.26/dist/sweetalert2.all.js';

export function toast(title, message, icon = 'info', options = {}) {
    const defaults = {
        title: title,
        html: message,
        icon: icon,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Sweetalert2.stopTimer)
            toast.addEventListener('mouseleave', Sweetalert2.resumeTimer)
        }
    }
    return Sweetalert2.fire({...defaults, ...options});
}

export async function alert(title, message, icon = 'info', options = {}) {
    const defaults = {
        title: title,
        html: message,
        icon: icon,
        showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster',
            icon: 'animate__animated animate__pulse animate__delay-1s'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster',
        }
    }
    return await Sweetalert2.fire({...defaults, ...options});
}

export async function confirm(title, message, options = {}) {
    const defaults = {
        title: title,
        html: message,
        icon: 'question',
        showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster',
            icon: 'animate__animated animate__pulse animate__delay-1s'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster',
        },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Proceed'
    };
    let result = await Sweetalert2.fire({...defaults, ...options});
    return result.isConfirmed;
}

// Create a custom alert type. defaults param should be a SweetAlert2 config.
export function createCustom(defaults) {
    return async (title, message, icon, options) => {
        return await Sweetalert2.fire({
            ...defaults,
            title: title,
            html: message,
            icon: icon || defaults.icon || undefined,
            ...options
        })
    }
}