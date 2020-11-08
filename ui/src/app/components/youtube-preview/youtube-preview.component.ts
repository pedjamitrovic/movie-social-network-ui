import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-youtube-preview',
  templateUrl: './youtube-preview.component.html',
  styleUrls: ['./youtube-preview.component.scss']
})
export class YoutubePreviewComponent implements OnInit, AfterViewInit {
  @Input() public set url(v: string) {
    this.updateVideoId(v);
  }

  @ViewChild('container') public container: ElementRef;

  public width = 500;
  public height = 300;

  public src: string;

  private readonly youtubeVideoRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.updateSize();
  }

  public updateSize() {
    const container = this.container.nativeElement as HTMLDivElement;
    this.width = container.offsetWidth;
    this.height = this.width / 2;
  }

  private updateVideoId(url: string) {
    console.log(url);
    if (!url) {
      this.src = '';
    }
    else {
      const results = this.youtubeVideoRegex.exec(url);
      const id = results[1];
      console.log(id);
      if (!id) {
        this.src = '';
      }
      else this.src = `https://www.youtube.com/embed/${id}`;
    }

  }

}
