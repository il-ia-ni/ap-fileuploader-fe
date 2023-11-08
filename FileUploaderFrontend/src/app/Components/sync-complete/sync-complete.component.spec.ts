import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncCompleteComponent } from './sync-complete.component';

describe('SyncCompleteComponent', () => {
  let component: SyncCompleteComponent;
  let fixture: ComponentFixture<SyncCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SyncCompleteComponent]
    });
    fixture = TestBed.createComponent(SyncCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
