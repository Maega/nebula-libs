# :package: NebulaModal

**:construction: NebulaModal is a work in progress. Documentation may be missing or outdated. :construction:**

### :open_book: Initialisation

```javascript
// Import Library
import * as modal from './lib/modal.lib.js';
```

### :wrench: Creating Disposable Modals

```javascript
// Open an image modal via an image URL
modal.image(url, options);

// Open an image modal via an img tag selector
modal.image(selector, options);

// Open a modal with an iframe as its content
modal.iframe(url, options);

/**
* Create a modal with a custom HTML string as its content
* - Accepts a HTML string, creates a new modal and opens it.
* - The modal is destroyed on close. To keep the created modal in the DOM for reuse the modal.register method can be used.
* - This method does not perform any XSS mitigations. You need to make those security considerations yourself!
*/
modal.create(htmlString, options);

/**
* Async/Await Modal Invocation
* - All modal invocation methods return a promise which resolves when the modal is closed.
* - By using await within an asynchronous function, you can wait for the invoked modal to close before continuing execution.
*/
await modal.iframe(url, options);
console.log('The modal was closed!');
```

### :recycle: Reusing Modals

```javascript
/**
* Create a new modal with a custom HTML string as its content and save it to the DOM for later use
* - Accepts a HTML string and modal ID and creates a new modal *without* opening it.
* - The modalId param must be unique and is used to invoke the modal with modal.open at a later time.
* - The new modal can be opened with the modal.open method and does not get destroyed on close.
* - This method does not perform any XSS mitigations. You need to make those security considerations yourself!
*/
modal.register(htmlString, modalId, options);

// Opens a previously registered model
modal.open(modalId);

// Closes a currently opened & registered modal
modal.close(modalId);
```

### :gear: Custom Options

```javascript
// An options object can optionally be passed to modal invocation and registration methods to specify custom behaviours
// The example below represents the default options if no custom object properties are passed to the invocation method
options = {
  animate: true,
  fullscreen: false,
  allowFullscreen: false
}
```

### :tada: Event Handling

#### NebulaModal Events:

| Event Name | Description |
| ---------- | ----------- |
| onOpening  | Fires when a new modal is being invoked |
| onOpened   | Fires when a new modal has finished opening |
| onClosing  | Fires when a new modal is being closed |
| onClosed   | Fires when a new modal has finished closing |

#### Event Handling:

```javascript
/**
* Adds an event listener to all modals
* - Accepts any NebulaModal event and a handler function.
*/
audio.on(event, handlerFunction);

// Removes all listeners associated with an event
audio.off(event);
```
