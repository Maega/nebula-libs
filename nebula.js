const nebula = {};

import * as notify from './lib/alerts.lib.js';
nebula.notify = notify;

import * as modal from './lib/modal.lib.js';
nebula.modal = modal;

import NebulaAudio from './lib/audio.lib.js';
nebula.audio = new NebulaAudio();

import NebulaWindow from './lib/window.lib.js';
window.NebulaWindow = NebulaWindow;

import NebulaPrefs from './lib/settings.lib.js';
nebula.settings = new NebulaPrefs([
    {
        id: 'debug.testVar',
        default: true,
        apply: async (newVar) => {
            console.log('Newly applied value is: ' + newVar);
        }
    }
]);

window.nebula = nebula;