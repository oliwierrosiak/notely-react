import { PencilBrush } from 'fabric';

export default class EraserBrush extends PencilBrush {
  constructor(canvas) {
    super(canvas);
  }
  createPath(pathData) {
    const path = super.createPath(pathData);
    path.globalCompositeOperation = 'destination-out';
    return path;
  }
  _render() {
    this.canvas.contextTop.globalCompositeOperation = 'destination-out';
    super._render();
    this.canvas.contextTop.globalCompositeOperation = 'source-over';
  }
}