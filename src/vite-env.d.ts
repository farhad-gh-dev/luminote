/// <reference types="vite/client" />

// Add support for CSS imports with ?inline query
declare module "*.css?inline" {
  const content: string;
  export default content;
}
