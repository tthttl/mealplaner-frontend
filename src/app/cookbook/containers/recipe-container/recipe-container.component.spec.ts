import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeContainerComponent } from './recipe-container.component';

describe('RecipeContainerComponent', () => {
  let component: RecipeContainerComponent;
  let fixture: ComponentFixture<RecipeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
