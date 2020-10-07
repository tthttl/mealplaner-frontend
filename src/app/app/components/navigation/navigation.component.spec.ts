import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { Directive, HostListener, Input } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

/* tslint:disable */
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
/* tslint:enable*/


describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationComponent, TranslatePipe, RouterLinkDirectiveStub],
      imports: [SharedModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display register link if not logged in', () => {
    const hostElement = fixture.nativeElement;
    const registerLink = hostElement.querySelector('[data-test="register-link"]');
    expect(registerLink).toBeTruthy();
  });

  it('should hide register link if not logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const hostElement = fixture.nativeElement;
    const registerLink = hostElement.querySelector('[data-test="register-link"]');
    expect(registerLink).toBeNull();
  });

  it('should display login link if not logged in', () => {
    const hostElement = fixture.nativeElement;
    const loginLink = hostElement.querySelector('[data-test="login-link"]');
    expect(loginLink).toBeTruthy();
  });

  it('should hide login link if not logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const hostElement = fixture.nativeElement;
    const loginLink = hostElement.querySelector('[data-test="register-login"]');
    expect(loginLink).toBeNull();
  });

  it('should hide logout button if not logged in', () => {
    const hostElement = fixture.nativeElement;
    const logoutButton = hostElement.querySelector('[data-test="logout-button"]');
    expect(logoutButton).toBeNull();
  });

  it('should show logout button if  logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const hostElement = fixture.nativeElement;
    const logoutButton = hostElement.querySelector('[data-test="logout-button"]');
    expect(logoutButton).toBeTruthy();
  });

  it('should hide main navigation if not logged in', () => {
    const hostElement = fixture.nativeElement;
    const desktopNavigation = hostElement.querySelector('[data-test="desktop-navigation"]');
    const mobileNavigation = hostElement.querySelector('[data-test="mobile-navigation"]');
    expect(desktopNavigation).toBeNull();
    expect(mobileNavigation).toBeNull();
  });

  it('should show main navigation if logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const hostElement = fixture.nativeElement;
    const desktopNavigation = hostElement.querySelector('[data-test="desktop-navigation"]');
    const mobileNavigation = hostElement.querySelector('[data-test="mobile-navigation"]');
    expect(desktopNavigation).toBeTruthy();
    expect(mobileNavigation).toBeTruthy();
  });

  it('should emit logout', () => {
    spyOn(component.logout, 'emit');
    component.isLoggedIn = true;
    fixture.detectChanges();
    const hostElement = fixture.nativeElement;
    hostElement.querySelector('[data-test="logout-button"]').click();
    expect(component.logout.emit).toHaveBeenCalledTimes(1);
  });
});
