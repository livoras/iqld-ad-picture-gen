import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  public bottomText = 'web';
  public canvas: HTMLCanvasElement = null;
  public ctx: CanvasRenderingContext2D;
  public bgColor = '#ccc';
  public imagePath = 'assets/logo.jpeg';
  public width = 1080;
  public height = 1920;
  @ViewChild('image', { read: ElementRef, static: true })
  public imageRef: ElementRef;

  ngOnInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.initRendering();
  }

  public initRendering(): void {
    requestAnimationFrame(() => {
      this.ctx.save();
      this.render();
      this.ctx.restore();
      this.initRendering();
    });
  }

  public render(): void {
    const ctx = this.ctx;
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, 10000, 10000);

    const imageElement = this.imageRef.nativeElement;
    ctx.drawImage(
      imageElement,
      0,
      (this.height - this.width) / 2,
      this.width,
      this.width,
      );
  }
}
