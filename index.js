// Host half of the VS Code themes plugin.
//
// Registers a Typert remote service (key "vscodeThemes") exposing the VS Code
// Marketplace search/fetch to the browser client. The browser is network
// restricted, so these calls run Host-side; the verified pure logic lives in
// ./marketplace.js and is wrapped here as @Remote methods.
//
// The decorator/transpile structure is copied verbatim from the proven
// @deepseek-ai/dsh-api-workspace-files host service: a TypertRemoteService whose
// Remote-decorated methods the api-gateway discovers by scanning the shared
// reflect.props for a typertRemote binding (collectSrcClaims). Because reflect.props
// is one shared object across the whole Cordis context tree, a service provided
// by this plugin fiber is visible to the Gateway regardless of tree position.
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { searchMarketplace, fetchThemeDefinition } from "./marketplace.js";
import { checkUpdate, applyUpdate } from "./update.js";

var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};

let VscodeThemes = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _search_decorators;
	let _fetchTheme_decorators;
	let _checkUpdate_decorators;
	let _applyUpdate_decorators;
	return class VscodeThemes extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_search_decorators = [Remote];
			_fetchTheme_decorators = [Remote];
			_checkUpdate_decorators = [Remote];
			_applyUpdate_decorators = [Remote];
			__esDecorate(this, null, _search_decorators, {
				kind: "method",
				name: "search",
				static: false,
				private: false,
				access: {
					has: (obj) => "search" in obj,
					get: (obj) => obj.search
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _fetchTheme_decorators, {
				kind: "method",
				name: "fetchTheme",
				static: false,
				private: false,
				access: {
					has: (obj) => "fetchTheme" in obj,
					get: (obj) => obj.fetchTheme
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _checkUpdate_decorators, {
				kind: "method",
				name: "checkUpdate",
				static: false,
				private: false,
				access: {
					has: (obj) => "checkUpdate" in obj,
					get: (obj) => obj.checkUpdate
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _applyUpdate_decorators, {
				kind: "method",
				name: "applyUpdate",
				static: false,
				private: false,
				access: {
					has: (obj) => "applyUpdate" in obj,
					get: (obj) => obj.applyUpdate
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		config = __runInitializers(this, _instanceExtraInitializers);
		constructor(ctx, config) {
			super(ctx, "vscodeThemes");
			this.config = config;
			// The plugin is installed as a symlink onto its source checkout; the
			// resolved (realpath) directory is what the update logic pulls into.
			this.pluginDir = path.dirname(fileURLToPath(import.meta.url));
		}
		/** Search the VS Code Marketplace for themes matching a query. */
		async search(query) {
			return searchMarketplace(query);
		}
		/** Download and parse one extension's theme definition into DSW tokens. */
		async fetchTheme(ext) {
			return fetchThemeDefinition(ext);
		}
		/** Compare the installed version against the live GitHub repo. */
		async checkUpdate() {
			return checkUpdate(this.pluginDir);
		}
		/** Install the latest version from the live GitHub repo. */
		async applyUpdate() {
			return applyUpdate(this.pluginDir);
		}
	};
})();

export { VscodeThemes };
export default VscodeThemes;
