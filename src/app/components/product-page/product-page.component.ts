import { Component, HostListener, Input, OnInit } from '@angular/core';
import { I18n, Language } from '../../shared/model/model';
import { DEFAULT_LANGUAGE } from '../../shared/helpers/constants';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit {
  @Input() translations: I18n | null = {};
  @Input() currentLanguage: Language | null = DEFAULT_LANGUAGE;

  windowHeight = 0;
  plateRotationDegree = 0;
  elements: HTMLElement[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.windowHeight = window.innerHeight;
    this.elements = Array.from(document.querySelectorAll('.product-page__feature-explanation-image-wrapper--hidden'));
    setTimeout(() => this.animateAppearingElements(), 300);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.animatePlate();
    this.animateAppearingElements();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.animateAppearingElements();
  }

  animatePlate(): void {
    this.plateRotationDegree = window.pageYOffset / 8;
  }

  animateAppearingElements(): void {
    const a = this.elements
      .filter((element) => {
        return element.getBoundingClientRect().top - this.windowHeight <= 0;
      }).forEach(element => {
        element.classList.remove('product-page__feature-explanation-image-wrapper--hidden');
        element.classList.add('product-page__feature-explanation-image-wrapper--visible');
      });
  }
}

