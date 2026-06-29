import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmDetails } from './vm-details';

describe('VmDetails', () => {
  let component: VmDetails;
  let fixture: ComponentFixture<VmDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VmDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(VmDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
