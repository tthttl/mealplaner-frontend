import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

import { RegisterPageComponent } from './register-page.component';
import { SharedModule } from '../../../../shared/shared.module';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { APP_INITIALIZER } from '@angular/core';
import { fas } from '@fortawesome/free-solid-svg-icons';

describe('RegisterFormComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedModule, RouterTestingModule],
      declarations: [RegisterPageComponent, FaIconComponent, TranslatePipe, AuthFormComponent],
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
    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit credentials when inputs are filled and button is clicked', () => {
    spyOn(component.credentialsReceived, 'emit');
    const hostElement = fixture.nativeElement;
    const nameInput = hostElement.querySelector('input[name="name"]');
    const emailInput = hostElement.querySelector('input[type="email"]');
    const passwordInput = hostElement.querySelector('input[type="password"]');
    const invitationCodeInput = hostElement.querySelector('input[name="invitationCode"]');

    nameInput.value = 'Joe';
    nameInput.dispatchEvent(new Event('input'));
    emailInput.value = 'joe.doe@gmail.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'uncrackable';
    passwordInput.dispatchEvent(new Event('input'));
    invitationCodeInput.value = 'Code';
    invitationCodeInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = hostElement.querySelector('button');
    button.click();

    expect(component.credentialsReceived.emit).toHaveBeenCalledWith({
      name: 'Joe',
      email: 'joe.doe@gmail.com',
      password: 'uncrackable',
      invitationCode: 'Code',
    });
  });
});
