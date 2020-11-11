import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';

import { RegisterFormPageComponent } from './register-form-page.component';
import { SharedModule } from '../../../shared/shared.module';
import { AuthFormComponent } from '../auth-form/auth-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormPageComponent;
  let fixture: ComponentFixture<RegisterFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [RegisterFormPageComponent, TranslatePipe, AuthFormComponent],
      providers: [
        {
          provide: TranslatePipe,
          useClass: TranslatePipe
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormPageComponent);
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
