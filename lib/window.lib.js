// Nebula Framework - Window Manager

// Import jQuery
import $ from '../vendor/jquery.vendor.js';

const defaultOptions = {
    title: 'New Window',
    isResizable: true,
    isDraggable: true,
    isBorderless: false,
    position: {top: 80, left: 10},

    // * Sample Options
    /* classes: [], // ? 'classes' prop can be a string array or space delimited string
    size: {height: 300, width: 600, isCollapsed: false},
    onOpened: () => {},
    onClosing: () => {},
    onClosed: () => {},
    onPosChanged: () => {},
    onSizeChanged: () => {} */
}

// Instantiate this class to create a new window instance
// Accepts HTML data as content and creates a dynamic, draggable window
export default class NebulaWindow {

    // * Initialise a new window
    constructor(html, setOptions) {

        // If the window container doesn't already exist in the DOM, create it now.
        if (!document.querySelector('#windowManager')) document.querySelector('body').insertAdjacentHTML('beforeend', '<div id="windowManager"></div>');

        // Merge defaultOptions with passed options if applicable
        this._options = typeof setOptions === 'object'
            ? {...defaultOptions, ...setOptions}
            : defaultOptions;

        // Fetch target content from DOM
        const content = html;

        // Generate Instance Seed
        this.seed = 's' + parseInt(Math.random() * 100000000000).toString();

        // Prepare windowShell
        let windowShell = document.createElement('div');
        windowShell.classList.add('window');

        // Add is-resizable class if applicable
        if (this._options.isResizable) windowShell.classList.add('is-resizable');

        // Add is-borderless class if applicable
        if (this._options.isBorderless) windowShell.classList.add('is-borderless');

        // Add custom classes to windowShell
        if (this._options.classes) {
            const customClasses = Array.isArray(this._options.classes)
                ? this._options.classes
                : this._options.classes.split(' ');
            if (customClasses.length) windowShell.classList.add(...customClasses);
        }

        // Set windowShell ID to window seed
        windowShell.id = 'shell-' + this.seed;

        // Create window-content element
        let windowContent = document.createElement('div');
        windowContent.classList.add('window-content');
        windowContent.innerHTML = content;

        // Create title bar
        let titleBar = document.createElement('div');
        titleBar.classList.add('window-titlebar', 'drag-handle');

        // Create title bar text
        let titleContent = document.createElement('span');
        titleContent.innerText = `${this._options.title} (shell:${this.seed})`;
        titleBar.append(titleContent);

        // Create title bar controls
        $(titleBar).append(`
            <span class="window-controls">
                <a class="has-text-white window-trigger-collapse">&#128469;</a>
                <a class="has-text-white window-trigger-close">&#128473;</a>
            </span>
        `);

        // Bind click event on collapse/minimise trigger
        $(titleBar).find('.window-trigger-collapse').on('click', event => {
            this.toggleCollapse();
        });

        // Bind click event on close trigger
        $(titleBar).find('.window-trigger-close').on('click', event => {
            this.close();
        });
    
        // Build complete window element and append to DOM
        windowShell.prepend(titleBar);
        windowShell.append(windowContent);
        $('#windowManager').append(windowShell);

        // If draggable option set, make the window draggable
        if (this._options.isDraggable) this.makeDraggable(windowShell);

        // Set this.element to windowShell element
        this.element = windowShell;

        // If position option passed, set window position accordingly
        if (this._options.position) this.setWindowPos(this._options.position);

        // If size option passed, set window size accordingly
        if (this._options.size) this.setWindowSize(this._options.size);

        // Initialise ResizeObserver (to track changes in window size)
        var ro = new ResizeObserver(entries => {
            for (let entry of entries) {
                // If an onSizeChanged function is passed as an options prop to the constructor, execute it now
                if (typeof this._options.onSizeChanged === 'function') this._options.onSizeChanged(this);
            }
        });

        // Start observing window size changes
        ro.observe(this.element);

        // Run onOpened function if passed
        if (typeof this._options.onOpened === 'function') this._options.onOpened(this);

    }

    toggleCollapse() {
        $(this.element).toggleClass('is-collapsed');
    }

    async close() {
        if (typeof this._options.onClosing === 'function') await this._options.onClosing(this);
        this.element.remove();
        if (typeof this._options.onClosed === 'function') await this._options.onClosed(this);
    }

    get position() {
        return $(this.element).offset();
    }

    get size() {
        const elem = $(this.element);
        return {
            height: elem.height(),
            width: elem.width(),
            isCollapsed: $(elem).hasClass('is-collapsed')
        }
    }

    setWindowPos(offset) {

        const elem = $(this.element);

        // If position is outside of the current viewport dimensions, move it inside
        if (offset.top > window.innerHeight  - elem.height()) offset.top = (window.innerHeight - elem.height());
        if (offset.left > window.innerWidth - elem.width()) offset.left = (window.innerWidth - elem.width());

        // If position is above the top of the viewport, move it inside
        if (offset.top < 0) offset.top = 0;

        // If position is to the left of viewport left zero, move it inside
        if (offset.left < 0) offset.left = 0;

        elem.offset(offset);

        // If an onPosChanged function is passed as an options prop to the constructor, execute it now
        if (typeof this._options.onPosChanged === 'function') this._options.onPosChanged(this);

    }

    setWindowSize(size) {

        const elem = $(this.element);

        // If height or width is larger than viewport dimensions, resize to fit
        if (size.height > window.innerHeight - 50) size.height = window.innerHeight - 50;
        if (size.width > window.innerWidth - 50) size.width = window.innerWidth - 50;

        size.isCollapsed
            ? elem.addClass('is-collapsed')
            : elem.removeClass('is-collapsed');

        elem.height(size.height);
        elem.width(size.width);

        // If onSizeChanged function is passed, it executes in the ResizeObserver and not here since any size change triggers the observer anyway

    }

    // Make window draggable
    makeDraggable(elem) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
        const targetElem = $(elem);
        const dragHandle = $(elem).find('.drag-handle');
    
        if (targetElem.length) console.log('Found target element!');
        if (dragHandle.length) console.log('Found drag handle!');
    
        // If dragHandle is present, bind mousedown event to it. Otherwise, attach event handler directly to target element.
        dragHandle.length
            ? dragHandle.on('mousedown', dragMouseDown)
            : targetElem.on('mousedown', dragMouseDown);
      
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
    
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
    
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
    
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
    
            // set the element's new position:
            targetElem.css('top', (targetElem.offset().top - pos2) + "px");
            targetElem.css('left', (targetElem.offset().left - pos1) + "px");
        }
      
        const closeDragElement = () => {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;

            // Set final window position (snaps window to viewport if it's out of bounds etc..)
            this.setWindowPos($(this.element).offset());
    
        }
    }

}