// Minimal, correct 24-bit BMP writer. Browsers cannot encode BMP through
// canvas.toBlob, so Convertly writes the file itself.
export function encodeBMP(canvas) {
  const { width: w, height: h } = canvas;
  const data = canvas.getContext('2d').getImageData(0, 0, w, h).data;
  const rowSize = Math.floor((24 * w + 31) / 32) * 4;
  const pixelSize = rowSize * h;
  const fileSize = 54 + pixelSize;
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  view.setUint8(0, 0x42);
  view.setUint8(1, 0x4d);
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, w, true);
  view.setInt32(22, h, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(34, pixelSize, true);
  view.setInt32(38, 2835, true);
  view.setInt32(42, 2835, true);

  for (let y = 0; y < h; y += 1) {
    const srcRow = (h - 1 - y) * w * 4;
    let out = 54 + y * rowSize;
    for (let x = 0; x < w; x += 1) {
      const i = srcRow + x * 4;
      bytes[out] = data[i + 2];
      bytes[out + 1] = data[i + 1];
      bytes[out + 2] = data[i];
      out += 3;
    }
  }
  return new Blob([buffer], { type: 'image/bmp' });
}