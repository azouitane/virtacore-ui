import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVm } from './create-vm';

describe('CreateVm', () => {
  let component: CreateVm;
  let fixture: ComponentFixture<CreateVm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateVm],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateVm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
