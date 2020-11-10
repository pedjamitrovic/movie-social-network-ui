import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Constants } from '@util/constants';

@Component({
  selector: 'app-youtube-preview',
  templateUrl: './youtube-preview.component.html',
  styleUrls: ['./youtube-preview.component.scss']
})
export class YoutubePreviewComponent implements OnInit {
  @Input() set url(v: string) {
    this.updateVideoId(v);
  }

  src: string;

  constructor() { }

  ngOnInit() {
  }

  updateVideoId(url: string) {
    if (!url) this.src = null;
    else {
      const results = Constants.YOUTUBE_URL_REGEX.exec(url);
      const id = results[1];
      if (!id) this.src = null;
      else this.src = `https://www.youtube.com/embed/${id}`;
    }
  }

}
