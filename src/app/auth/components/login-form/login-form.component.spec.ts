import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { SharedModule } from '../../../shared/shared.module';
import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [LoginFormComponent, TranslatePipe],
      providers: [
        {
          provide: TranslatePipe,
          useClass: TranslatePipe
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('button should be disabled when inputs are empty', () => {
    const hostElement = fixture.nativeElement;
    const button = hostElement.querySelector('button');
    expect(button.disabled).toBeTruthy();
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
