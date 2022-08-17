/********************************************************************
 **                          Nebula Alerts                         **
 *? SweetAlert2 wrapper to handle toasts, alerts and confirmations  *
 *!  This is currently WIP and documentation is subject to change   *
 **                       Tristan Gauci, 2022                       *
*********************************************************************/

// Import SweetAlert2
import 'https://cdn.jsdelivr.net/npm/sweetalert2@11.4.26/dist/sweetalert2.all.js';
// TODO: Replace iziToast and use SweetAlert2 for toasts aswell to reduce dependencies and unify option args

export default class NebulaAlert {

    constructor(options) {
        // TODO: Initialise a Sweetalert2 instance using the options object passed to the constructor.

        this._toast = Sweetalert2.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Sweetalert2.stopTimer)
                toast.addEventListener('mouseleave', Sweetalert2.resumeTimer)
            }
        })
    }

    toast(title, message, options = {}) {
        /* let defaults = {
            title: title,
            message: message,
            //theme: 'light',
            icon: 'material-icons-round',
            iconText: 'notifications_active',
            //iconColor: '#cecece',
            animateInside: false,
            displayMode: 'replace',
            timeout: 3000,
            progressBar: false,
            transitionIn: 'fadeInDown',
            transitionOut: 'fadeOutUp',
            resetOnHover: true,
            target: '.navbar-toast'
        }
        iziToast.show({...defaults, ...options}); */

        this._toast.fire({
            icon: 'success',
            title: title
        })
    }

    async alert(title, message, icon = 'info', options = {}) {
        let defaults = {
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
        await Sweetalert2.fire({...defaults, ...options});
    }

    async confirm(title, message, options = {}) {
        let defaults = {
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

}