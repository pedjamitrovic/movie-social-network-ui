

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { SplashComponent } from '../components/splash/splash.component';

@Injectable({
  providedIn: 'root'
})
export class SplashService {
  public overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
  ) { }

  open() {
    if (this.overlayRef) { this.close(); }
    const config = new OverlayConfig({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    });
    this.overlayRef = this.overlay.create(config);
    const imagePreviewPortal = new ComponentPortal(SplashComponent);
    this.overlayRef.attach(imagePreviewPortal);
  }

  close() {
    if (this.overlayRef) { this.overlayRef.dispose(); }
    this.overlayRef = null;
  }

}
