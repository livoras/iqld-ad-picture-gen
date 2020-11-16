import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface ITextConfig {
  content: string;
  family: string;
  weigth: string;
  size: number;
  color: string;
  paddingTop: number;
}

interface  IConfig {
  bgColor: string;
  imagePath: string;
  textPadding: number;
  texts: ITextConfig[];
}

const defaultTextConfig = {
  content: 'Content',
  family: 'Dubai',
  weigth: '',
  size: 70,
  color: '#000',
  paddingTop: 10,
};

const defaultConfig: IConfig = {
  bgColor: '#ccc',
  imagePath: '',
  textPadding: 0.5,
  texts: [],
};

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
  public image: HTMLImageElement;

  @ViewChild('image', { read: ElementRef, static: true })
  public imageRef: ElementRef;

  ngOnInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(2, 2);
    this.restoreConfig();
    this.initRendering();
    this.saveConfigurationIntervally();
  }

  public initRendering(): void {
    requestAnimationFrame(() => {
      this.ctx.save();
      this.render();
      this.ctx.restore();
      this.initRendering();
    });
  }

  public get totalHeight(): number {
    return this.config.texts.reduce((n, c) => {
      return n + c.size + c.paddingTop;
    }, this.width);
  }

  public render(): void {
    const ctx = this.ctx;
    ctx.fillStyle = this.config.bgColor;
    ctx.fillRect(0, 0, 10000, 10000);

    const imageElement = this.image || this.imageRef.nativeElement;
    const imageStartY = (this.height - this.totalHeight) / 2;
    ctx.drawImage(
      imageElement,
      0,
      imageStartY,
      this.width,
      this.width,
    );

    let bottomTop = imageStartY + this.width;

    this.config.texts.forEach((textConfig: ITextConfig) => {
      ctx.save();
      ctx.fillStyle = textConfig.color;
      const MAX_TEXT_WIDTH = this.width;
      bottomTop = bottomTop + textConfig.paddingTop;
      ctx.font = `${textConfig.weigth} ${textConfig.size}px ${textConfig.family}`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      const lines = textConfig.content.split('\n');
      const x = this.width / 2;
      const y = bottomTop;
      const LINE_HEIGHT = textConfig.size;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + (i * LINE_HEIGHT), MAX_TEXT_WIDTH);
        bottomTop += LINE_HEIGHT;
      }
      ctx.restore();
    });
  }

  public handleChangeFile(e: Event): void {
    // Create a data URL from the image file
    const imageFile = (e.target as any).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = (e: any) => {
      const myImage = new Image(); // Creates image object
      myImage.src = (e.target as any).result; // Assigns converted image to image object
      myImage.onload = (ev) => {
        this.image = myImage;
      };
    };
  }

  public handleAddText(): void {
    this.config.texts.push(Object.assign({}, defaultTextConfig));
  }

  private saveConfigurationIntervally() {
    setInterval(() => {
      try {
        localStorage.setItem('configuration', JSON.stringify(this.config));
      } catch (e) {
        console.log(e);
      }
    }, 3000);
  }

  private restoreConfig() {
    try {
      this.config = Object.assign({}, defaultConfig, JSON.parse(localStorage.getItem('configuration')) || defaultConfig);
    } catch (e) {
      this.config = defaultConfig;
    }
  }
}
