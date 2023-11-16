# :musical_note: NebulaAudio

**⚠️ This version of NebulaAudio is deprecated. An up-to-date version is now available [here](https://github.com/paradoxepoch/web-audio-player) as an [NPM module](https://www.npmjs.com/package/@paradoxepoch/web-audio-player).**

NebulaAudio is a HTMLAudioElement interface wrapper that adds a few convenience methods and jQuery-like event listener management.

### :open_book: Initialisation

```javascript
// Import Library
import NebulaAudio from './lib/audio.lib.js';

// Create a new audio instance (optionally accepts a source URL)
const audio = new NebulaAudio(src);
```

### :loud_sound: Playback Controls

```javascript
// Change audio source
audio.src = 'http://example.com/audio.mp3';

/**
* Set audio volume with a swing fade.
* - Accepts new volume (0-100), fade duration (ms) and an interval (ms).
* - Only the new volume param is required. Fade duration and interval are optional and default to 1500ms and 13ms respectively.
* - Returns a promise that resolves when the fade completes.
*/
audio.setVolume(newVolume, fadeMs, intervalMs);

// Play audio
audio.play();

// Pause audio
audio.pause();

// Stop audio (resets position to 0)
audio.stop();

// Toggle audio playback (between play & stop)
audio.toggle();

// Getter, returns bool of audio playback status
audio.isPlaying;

// Getter, return bool of whether audio will loop
audio.loop;

// Setter, sets whether audio will loop (bool)
audio.loop = true;
```

### :tada: Event Handling

```javascript
/**
* Adds an event listener to the NebulaAudio instance
* - Accepts any HTMLAudioElement event and a handler function.
* - Returns index of handler function in this._eventHandlers[event] array. Can be passed to this.off to remove the listener.
*/
audio.on(event, handlerFunction);

/**
* Removes all listeners associated with an event from the NebulaAudio instance,
* or optionally a specific listener if handlerIndex is specified
* - Accepts the event name and optionally the index of a specific listener to remove.
*   If no handlerIndex is provided, removes all listeners bound to the event.
*/
audio.off(event, handlerIndex);
```
