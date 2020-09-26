export class Plugin {
    constructor(name, fn, options) {
        this.name = name;
        this.fn = fn;
        this.options = options;
        this.loaded = false;
    }

    async ensured() {
        if (this.loaded) return;
        if (typeof this.fn != "function") return;
        var plugin = await this.fn();
        if (typeof plugin == "object") {
            // es6 Module
            if (plugin.__esModule && plugin.default) {
                plugin = plugin.default;
            }

            plugin.install && plugin.install(L, this.options);
        }
        this.loaded = true;
    }
}

export class Plugins {
    async loadAsync(items) {
        if (typeof items == "string") {
            items = [items];
        }
        if (!Array.isArray(items)) return;

        for (var item of items) {
            if (this[item] && !this[item].loaded) {
                await this[item].ensured();
            }
        }
    }
}
