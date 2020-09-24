import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';

import { RecipeFormComponent } from './recipe-form.component';

describe('RecipeFormComponent', () => {
  let component: RecipeFormComponent;
  let fixture: ComponentFixture<RecipeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeFormComponent, TranslatePipe ],
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
    fixture = TestBed.createComponent(RecipeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
