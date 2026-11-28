# PulseWorks AI

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Analytics API

The Analytics page reads task data from JSONPlaceholder by default. To use a
different compatible endpoint, set `VITE_ANALYTICS_API_URL` in `.env` to an
HTTP(S) URL returning a JSON array of `{ "id", "userId", "title", "completed" }`
items. Restart the Vite server after changing environment variables.

Vite exposes `VITE_` variables in browser code. Do not put API keys or other
secrets in them; use a server-side proxy if an API requires credentials.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
