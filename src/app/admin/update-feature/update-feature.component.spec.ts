import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFeatureComponent } from './update-feature.component';

describe('UpdateFeatureComponent', () => {
  let component: UpdateFeatureComponent;
  let fixture: ComponentFixture<UpdateFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFeatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
