import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  windowScrolled = false;
  scrollable: CdkScrollable;

  constructor(
    private scrollDispatcher: ScrollDispatcher,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.scrollDispatcher.scrolled().subscribe(
      (scrollable: CdkScrollable) => {
        this.scrollable = scrollable;
        this.onWindowScroll();
      }
    );
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          // First scrollable container
          this.scrollable = this.scrollDispatcher.scrollContainers.keys().next().value;
          this.scrollToTop('auto');
        }
      }
    );
  }

  onWindowScroll() {
    const scrollTop = this.scrollable.getElementRef().nativeElement.scrollTop;
    if (scrollTop > 100) {
      this.windowScrolled = true;
    } else {
      this.windowScrolled = false;
    }
    this.cdr.detectChanges();
  }

  scrollToTop(behavior: 'auto' | 'smooth') {
    this.scrollable.scrollTo({ top: 0, behavior });
  }
}
