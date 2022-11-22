/********************************************************************
 **                          Nebula Modals                         **
 *?   iziToast wrapper to handle content and iframe based modals    *
 *!  This is currently WIP and documentation is subject to change   *
 **                       Tristan Gauci, 2022                       *
*********************************************************************/

// Import jQuery
//import $ from '../vendor/jquery.vendor.js';

// Import iziModal
//import 'https://cdn.jsdelivr.net/npm/izimodal@1.6.1/js/iziModal.min.js';

//window.$ = $;

const modalTypes = {
    iframe: (url) => `<iframe src="${url}"></iframe>`,
    image: (url) => `<img src="${url}">`,
    html: (content) => content
}

/*
 * 
 */
function generateModal(payload, type, options, startOpened = true, modalId) {

    options = {
        title: '',
        maxWidth: '730px',
        maxHeight: '800px',
        ...options
    };

    return `
        <div class="nebula-modal ${startOpened ? 'is-open' : ''}" ${modalId ? 'modal-id=' + modalId : ''} style="max-width:${options.maxWidth}; max-height:${options.maxHeight};">
            <div class="nebula-modal-header">
                <div class="nebula-modal-title">${options.title}</div>
                <div class="nebula-modal-controls">
                    <i class="nebula-modal-close fas fa-rectangle-xmark fa-2x"></i>
                </div>
            </div>
            <div class="nebula-modal-body">
                ${modalTypes[type](payload)}
            </div>
        </div>
    `;
}

export function image(url, options = {}) {
    const modalHtml = generateModal(url, 'image', options);
    const rootElem = document.getElementById('nebula-modal-root');
    rootElem.insertAdjacentHTML('beforeend', modalHtml);
    document.body.classList.add('is-modal-open');
}

export function iframe(url, options = {}) {
    const modalHtml = generateModal(url, 'iframe', options);
    const rootElem = document.getElementById('nebula-modal-root');
    rootElem.insertAdjacentHTML('beforeend', modalHtml);
    document.body.classList.add('is-modal-open');
}

export function register(htmlString, modalId, options) {
    const modalHtml = generateModal(htmlString, 'html', options, false, modalId);
    const rootElem = document.getElementById('nebula-modal-root');
    rootElem.insertAdjacentHTML('beforeend', modalHtml);
}

export function open(modalId) {
    document.body.classList.add('is-modal-open');
    document.querySelector(`#nebula-modal-root .nebula-modal[modal-id=${modalId}]`).classList.add('is-open');
}

// * Closes any active modals
export function close() {

    // Hide all modals
    document.querySelectorAll('#nebula-modal-root .nebula-modal').forEach(modal => modal.classList.remove('is-open'));

    // Hide modal root container
    document.body.classList.remove('is-modal-open');

    // Cleanup - Destroy unregistered modals
    document.querySelectorAll('#nebula-modal-root .nebula-modal:not([modal-id])').forEach(modal => modal.remove());
}

function init() {
    const css = `
        body #nebula-modal-root {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
            background: rgb(0 0 0 / 70%);
            /* backdrop-filter: blur(5px); */
            display: none;
            align-items: center;
            justify-content: center;
        }
        
        body.is-modal-open #nebula-modal-root {
            display: flex;
        }

        body.is-modal-open {
            height: 100vh;
            overflow: hidden;
        }
        
        #nebula-modal-root .nebula-modal {
            display: none;
            background: white;
            border-radius: 10px;
            /* max-width: 730px; */
            width: -webkit-fill-available;
            height: 80%;
            /* max-height: 800px; */
            overflow: hidden;
        }

        #nebula-modal-root .nebula-modal.is-open {
            display: block;
        }
        
        #nebula-modal-root .nebula-modal > .nebula-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            padding: 5px 15px 0 15px;
        }

        #nebula-modal-root .nebula-modal .nebula-modal-title {
            font-weight: bold;
        }

        #nebula-modal-root .nebula-modal .nebula-modal-close {
            cursor: pointer;
            color: #555;
        }

        #nebula-modal-root .nebula-modal .nebula-modal-close:hover {
            color: #e36767;
        }
        
        #nebula-modal-root .nebula-modal > .nebula-modal-body {
            height: calc(100% - 55px);
            padding: 5px;
            overflow-y: auto;
        }
        
        #nebula-modal-root .nebula-modal > .nebula-modal-body iframe {
            width: -webkit-fill-available;
            height: -webkit-fill-available;
            border: none;
        }
    `;

    // Create style element and inject it into the DOM
    const cssElem = document.createElement('style');
    cssElem.innerHTML = css;
    document.querySelector('head').append(cssElem);

    // Create root element and inject it into the DOM
    const rootElem = document.createElement('div');
    rootElem.id = 'nebula-modal-root';
    document.querySelector('body').append(rootElem);

    // Create event listener
    document.addEventListener('click', function (event) {

        // If the user clicked on a modal close button, run the close method
        if (event.target.matches('.nebula-modal-close')) return close();

        // Get the clicked element's modal-trigger attribute
        const modalType = event.target.getAttribute('modal-trigger');

        // If this isn't a modal trigger, bail
        if (!modalType) return;

        // Don't follow the href...
        event.preventDefault();

        const options = {
            title: event.target.getAttribute('modal-title') || ''
        }

        switch(modalType) {
            case 'iframe':
                iframe(event.target.href, options);
                break;
            case 'image':
                image(event.target.src, options);
                break;
            default:
                console.error('Modal type does not exist!');
        }
    
    }, false);

}

document.addEventListener('DOMContentLoaded', () => init());