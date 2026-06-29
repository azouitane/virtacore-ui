import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LxcDetails } from './lxc-details';

describe('LxcDetails', () => {
  let component: LxcDetails;
  let fixture: ComponentFixture<LxcDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxcDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(LxcDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
