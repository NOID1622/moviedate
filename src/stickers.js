// src/stickers.js
const stickerModules = import.meta.glob('./assets/stickers/*.{png,webp,gif}', { eager: true });

const STICKERS = Object.values(stickerModules).map(m => m.default);

export default STICKERS;