import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vms } from './vms';

describe('Vms', () => {
  let component: Vms;
  let fixture: ComponentFixture<Vms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vms],
    }).compileComponents();

    fixture = TestBed.createComponent(Vms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
