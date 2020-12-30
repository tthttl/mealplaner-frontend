/* tslint:disable */
import { Directive, HostListener, Input } from '@angular/core';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Directive({
  selector: '[routerLink]'
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick(): void {
    this.navigatedTo = this.linkParams;
  }
}
