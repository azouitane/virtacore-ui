import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLxc } from './create-lxc';

describe('CreateLxc', () => {
  let component: CreateLxc;
  let fixture: ComponentFixture<CreateLxc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLxc],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLxc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
