// Nebula Framework - Settings Manager

// Import localforage
import 'https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js';

const settings = []

/* example:
{
    id: 'debug.console.visible',
    default: true,
    apply: async (isEnabled) => {
        isEnabled
            ? $('body').removeClass('is-console-hidden')
            : $('body').addClass('is-console-hidden');
    }
}
*/

export default class NebulaPrefs {
    constructor(settingsDict, dbName = 'default') {

        if (!Array.isArray(settingsDict)) throw new Error('Invalid settings dictionary, settingsDict must be an array');

        this._settingsDb = localforage.createInstance({name: dbName});

        settingsDict.forEach((setting, index) => {
            if (setting.id === undefined || setting.default === undefined) throw new Error(`The setting at index ${index} has an invalid ID or default property`);
            if (typeof setting.apply !== 'function') throw new Error(`Setting '${setting.id}' has a missing or invalid apply function`);
            settings.push(setting);
        });

    }

    // * Apply a setting
    // - Call with a setting ID to apply it
    // - Optionally add the value param to apply a different value to what's saved. (Good for previewing settings)
    async apply(settingId, value) {

        // Find the setting in the settings array
        const targetSetting = settings.find(setting => setting.id === settingId);
        if (!targetSetting) return console.error(`Setting ${settingId} does not exist`);

        // If custom value not specified, fetch the current value from store
        if (value === undefined) value = await this.get(settingId);

        // If the store doesn't have a value yet, set the default for this setting
        if (value === null) return await this.set(settingId, targetSetting.default);

        // Apply the setting
        await targetSetting.apply(value);

    }

    // * Apply all settings
    async applyAll() {
        await Promise.all(settings.map(async setting => {
            await this.apply(setting.id);
        }));
        console.log('Finished applying all settings');
        return;
    }

    async get(settingId) {

        // Find the setting in the settings array
        const targetSetting = settings.find(setting => setting.id === settingId);
        if (!targetSetting) {
            console.error(`Setting ${settingId} does not exist`);
            return null;
        }

        return this._settingsDb.getItem(settingId);
    }

    /**
     * Changes a setting's value in the database, then applies the new setting (by default)
     * @param {string} settingId - The id of the setting you want to change
     * @param value - The value to set the setting to
     * @param {boolean} [applyNew=true] - If false, setting will still be saved to the database but not applied.
     */
    async set(settingId, value, applyNew = true) {

        // Find the setting in the settings array
        const targetSetting = settings.find(setting => setting.id === settingId);
        if (!targetSetting) return console.error(`Setting ${settingId} does not exist`);

        await this._settingsDb.setItem(settingId, value);

        if (applyNew) await this.apply(settingId, value);

        return;

    }

    // Return an array of all settings objects and their current values
    async list() {
        const output = settings;
        await Promise.all(output.map(async setting => {
            const value = await this.get(setting.id);
            setting.value = value;
        }));
        return output;
    }

}