import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LxcContainers } from './lxc-containers';

describe('LxcContainers', () => {
  let component: LxcContainers;
  let fixture: ComponentFixture<LxcContainers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxcContainers],
    }).compileComponents();

    fixture = TestBed.createComponent(LxcContainers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
