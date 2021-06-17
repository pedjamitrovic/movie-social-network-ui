import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RenderedMedia } from '@models/internal/rendered-media.model';
import { EnvironmentService } from '@services/environment.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  apiUrl = `${this.environment.apiUrl}`;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
  ) {
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

  readFileFromUrl(url: string): Observable<File> {
    return this.http.get(`${this.apiUrl}/${url}`, { responseType: 'blob' }).pipe(map((blob) => new File([blob], url, { type: blob.type })));
  }
}
