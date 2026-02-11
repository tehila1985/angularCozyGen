import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FurnitureGallery } from './furniture-gallery';

describe('FurnitureGallery', () => {
  let component: FurnitureGallery;
  let fixture: ComponentFixture<FurnitureGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FurnitureGallery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FurnitureGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
