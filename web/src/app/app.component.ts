import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface  IConfig {
  bgColor: string,
  imagePath: string,
  textSize: number,
  fontFamily: string,
  textPadding: number,
  bottomText: string,
  textColor: string
}

const defaultConfig: IConfig = {
  bgColor: '#ccc',
  imagePath: '',
  textSize: 70,
  fontFamily: "Comic Sans MS",
  textPadding: 0.5,
  bottomText: '',
  textColor: '#000',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  public canvas: HTMLCanvasElement = null;

  public ctx: CanvasRenderingContext2D;

  public config: IConfig = defaultConfig;

  public width = 1080;
  public height = 1920;
  public image: HTMLImageElement

  @ViewChild('image', { read: ElementRef, static: true })
  public imageRef: ElementRef;

  ngOnInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(2, 2)
    this.restoreConfig()
    this.initRendering();
    this.saveConfigurationIntervally()
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
    ctx.fillStyle = this.config.bgColor;
    ctx.fillRect(0, 0, 10000, 10000);

    const imageElement = this.image || this.imageRef.nativeElement;
    ctx.drawImage(
      imageElement,
      0,
      (this.height - this.width) / 2,
      this.width,
      this.width,
      );

    ctx.fillStyle = this.config.textColor
    const MAX_TEXT_WIDTH = this.width;
    const PADDING = this.config.textSize * this.config.textPadding;
    const bottomTop = this.width + (this.height - this.width) / 2 + PADDING
    ctx.font = `${this.config.textSize}px ${this.config.fontFamily}`;
    ctx.textBaseline = "top"
    ctx.textAlign = "center";
    const lines = this.config.bottomText.split("\n")
    let x = this.width / 2
    let y = bottomTop
    const LINE_HEIGHT = this.config.textSize
    // ctx.fillText(this.bottomText, x, y, MAX_TEXT_WIDTH)
    for (let i = 0; i<lines.length; i++) {
      ctx.fillText(lines[i], x, y + (i * LINE_HEIGHT), MAX_TEXT_WIDTH);
    }
  }

  public handleChangeFile(e: Event): void {
    // Create a data URL from the image file
    let imageFile = (e.target as any).files[0]
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = (e) => {
      const myImage = new Image(); // Creates image object
      myImage.src = (e.target as any).result; // Assigns converted image to image object
      myImage.onload = (ev) => {
        this.image = myImage
      }
    }
  }

  private saveConfigurationIntervally() {
    setInterval(() => {
      try {
        localStorage.setItem('configuration', JSON.stringify(this.config))
      } catch(e) {
        console.log(e)
      }
    }, 3000)
  }

  private restoreConfig() {
    try {
      this.config = JSON.parse(localStorage.getItem('configuration')) || defaultConfig
    } catch(e) {
      this.config = defaultConfig
    }
  }
}
