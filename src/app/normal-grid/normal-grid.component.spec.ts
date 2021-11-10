import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalGridComponent } from './normal-grid.component';

describe('NormalGridComponent', () => {
  let component: NormalGridComponent;
  let fixture: ComponentFixture<NormalGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormalGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
