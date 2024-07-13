import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DessertItemComponent } from './dessert-item.component';

describe('DessertItemComponent', () => {
  let component: DessertItemComponent;
  let fixture: ComponentFixture<DessertItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DessertItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DessertItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
