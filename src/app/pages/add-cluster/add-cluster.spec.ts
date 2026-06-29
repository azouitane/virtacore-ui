import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCluster } from './add-cluster';

describe('AddCluster', () => {
  let component: AddCluster;
  let fixture: ComponentFixture<AddCluster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCluster],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCluster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
