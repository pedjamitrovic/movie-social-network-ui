import { Component, Input, OnInit } from '@angular/core';
import { RenderedMedia } from '@models/internal/rendered-media.model';

@Component({
  selector: 'app-media-preview',
  templateUrl: './media-preview.component.html',
  styleUrls: ['./media-preview.component.scss']
})
export class MediaPreviewComponent implements OnInit {
  @Input() renderedMedia: RenderedMedia;

  constructor() { }

  ngOnInit() { }

}
