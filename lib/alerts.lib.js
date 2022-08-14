// Import SweetAlert2
import 'https://cdn.jsdelivr.net/npm/sweetalert2@11.4.26/dist/sweetalert2.all.js';

export default class NebulaAlert {

    notify(title, message, options = {}) {
        let defaults = {
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
        iziToast.show({...defaults, ...options});
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