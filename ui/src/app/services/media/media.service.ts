import { Injectable } from '@angular/core';
import { RenderedMedia } from '@models/rendered-media.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor() {
  }

  async renderMedia(media: File[]): Promise<RenderedMedia> {
    const renderedMedia = new RenderedMedia();

    if (!media?.length) { return renderedMedia; }

    for (const file of media) {
      const result = await this.readFile(file);

      if (file.type.startsWith('image')) {
        renderedMedia.images.push(result.toString());
      }
      else if (file.type.startsWith('video')) {
        renderedMedia.videos.push(result.toString());
      }
    }

    return renderedMedia;
  }

  async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise(
      (resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
      }
    );
  }
}
