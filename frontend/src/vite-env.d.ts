/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string   // ✅ fixes import.meta.env red underline too
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// ✅ fixes ./index.css red underline
declare module '*.css' {
  const content: Record<string, string>
  export default content
}