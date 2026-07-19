# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Development

### Sample data model

```json
{
  "data": [
    {
      "id": "abc",
      "name": "Work",
      "launchers": [
        {
          "appName": "chrome",
          "action": "open",
          "profile": "Default",
          "tabGroup": {
            "name": "Docs",
            "color": "blue"
          },
          "links": [{ "url": "https://google.com" }]
        },
        {
          "appName": "vs-code",
          "action": "open",
          "path": "/projects/my-app"
        }
      ]
    }
  ]
}
```

### Get TypeScript data models updated as per rust

```sh
npm run types
```

If a new data model is added or a data model is removed, corresponding update is also needed in `src-tauri/src/bin/export_types.rs` file.
