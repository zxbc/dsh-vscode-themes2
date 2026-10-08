/**
 * Host half of the VS Code themes plugin.
 *
 * This plugin is Client-only: theme registration, application, and selection
 * persistence all happen in the browser half (client.js) using localStorage,
 * so the Host half is a no-op placeholder that satisfies the bundle loader.
 */
export function apply(ctx) {}
