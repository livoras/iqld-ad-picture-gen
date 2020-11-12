import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  public bottomText = '🔥🔥🔥 Most loved fire cat! 🔥🔥';
  public canvas: HTMLCanvasElement = null;
  public ctx: CanvasRenderingContext2D;
  public bgColor = '#ccc';
  public imagePath = '';
  public width = 1080;
  public height = 1920;
  public textSize = 70;
  public fontFamily = "Comic Sans MS";
  public textPadding = 0.2;
  public image: HTMLImageElement

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

    const imageElement = this.image || this.imageRef.nativeElement;
    ctx.drawImage(
      imageElement,
      0,
      (this.height - this.width) / 2,
      this.width,
      this.width,
      );

    ctx.fillStyle = "#000"
    const MAX_TEXT_WIDTH = this.width;
    const PADDING = this.textSize * this.textPadding;
    const bottomTop = this.width + (this.height - this.width) / 2 + PADDING
    ctx.font = `${this.textSize}px ${this.fontFamily}`;
    ctx.textBaseline = "top"
    ctx.textAlign = "center";
    ctx.fillText(this.bottomText, this.width / 2, bottomTop, MAX_TEXT_WIDTH)
  }

  public handleChangeFile(e: Event): void {
    const file = (e.target as any).files[0]
    // Create a data URL from the image file
    let imageFile = file
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = (e) => {
      var myImage = new Image(); // Creates image object
      myImage.src = (e.target as any).result; // Assigns converted image to image object
      myImage.onload = (ev) => {
        // const imgData = this.canvas.toDataURL("image/jpeg",0.75); // Assigns image base64 string in jpeg format to a variable
        // this.imagePath = imgData
        this.image = myImage
      }
    }
  }
}
