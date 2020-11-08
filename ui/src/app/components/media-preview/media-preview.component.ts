import { Component, Input, OnInit } from '@angular/core';
import { RenderedMedia } from '@models/rendered-media.model';

@Component({
  selector: 'app-media-preview',
  templateUrl: './media-preview.component.html',
  styleUrls: ['./media-preview.component.scss']
})
export class MediaPreviewComponent implements OnInit {
  @Input() public renderedMedia: RenderedMedia;

  constructor() { }

  ngOnInit(): void {
  }

}
