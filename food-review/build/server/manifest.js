const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.cfdd58fc.js","app":"_app/immutable/entry/app.4a05c08a.js","imports":["_app/immutable/entry/start.cfdd58fc.js","_app/immutable/chunks/scheduler.2a58b43e.js","_app/immutable/chunks/singletons.a94a21f4.js","_app/immutable/chunks/index.f8d0adc9.js","_app/immutable/entry/app.4a05c08a.js","_app/immutable/chunks/scheduler.2a58b43e.js","_app/immutable/chunks/index.89bdd15f.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-f69fff0c.js')),
			__memo(() => import('./chunks/1-a2573aa9.js')),
			__memo(() => import('./chunks/2-88be7ea6.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();

const prerendered = new Set([]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
