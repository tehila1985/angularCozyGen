import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showproducts } from './showproducts';

describe('Showproducts', () => {
  let component: Showproducts;
  let fixture: ComponentFixture<Showproducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showproducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showproducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
