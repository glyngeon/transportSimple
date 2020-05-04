import { Component, OnInit, HostListener, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('navbarWrapper', { read: ElementRef }) navbarWrapper: ElementRef;

  public menuToggleHtml: HTMLElement;
  public toggleFlag: boolean;
  constructor(private renderer: Renderer2, private router: Router) { }

  ngOnInit(): void {
    this.toggleFlag = false;
  }

  ngAfterInit() {
    this.menuToggleHtml = this.navbarWrapper.nativeElement.querySelector('.menu-toggle');
  }

  @HostListener('window: resize') resize() {
    if (window.innerWidth > 800) {
      this.toggleFlag = false;
      this.renderer.addClass(this.navbarWrapper.nativeElement.querySelector('.menu-toggle'), 'change');
      this.renderer.removeClass(this.navbarWrapper.nativeElement.querySelector('.menu-toggle'), 'change');
    }
  }
  menuToggle() {
    this.toggleFlag = !this.toggleFlag;
    if (this.toggleFlag) {
      this.renderer.addClass(this.navbarWrapper.nativeElement.querySelector('.menu-toggle'), 'change');
    } else {
      this.renderer.removeClass(this.navbarWrapper.nativeElement.querySelector('.menu-toggle'), 'change');
    }
  }
}
