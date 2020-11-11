import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';

import { LoginFormPageComponent } from './login-form-page.component';
import { SharedModule } from '../../../shared/shared.module';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { APP_INITIALIZER } from '@angular/core';
import { fas } from '@fortawesome/free-solid-svg-icons';

describe('LoginFormComponent', () => {
  let component: LoginFormPageComponent;
  let fixture: ComponentFixture<LoginFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedModule, FontAwesomeModule],
      declarations: [LoginFormPageComponent, TranslatePipe, AuthFormComponent],
      providers: [
        {
          provide: TranslatePipe,
          useClass: TranslatePipe
        },
        {
          provide: APP_INITIALIZER,
          useFactory: (iconLibrary: FaIconLibrary) => {
            return async () => {
              iconLibrary.addIconPacks(fas);
            };
          },
          deps: [FaIconLibrary],
          multi: true,
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit credentials when inputs are filled and button is clicked', () => {
    spyOn(component.credentialsReceived, 'emit');
    const hostElement = fixture.nativeElement;
    const emailInput = hostElement.querySelector('input[type="email"]');
    const passwordInput = hostElement.querySelector('input[type="password"]');

    emailInput.value = 'peter.muster@gmail.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'uncrackable';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = hostElement.querySelector('button');
    button.click();

    expect(component.credentialsReceived.emit).toHaveBeenCalledWith({
      identifier: 'peter.muster@gmail.com',
      password: 'uncrackable'
    });
  });
});
