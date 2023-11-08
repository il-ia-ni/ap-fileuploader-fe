import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncConfigComponent } from './sync-config.component';

describe('SyncConfigComponent', () => {
  let component: SyncConfigComponent;
  let fixture: ComponentFixture<SyncConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SyncConfigComponent]
    });
    fixture = TestBed.createComponent(SyncConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
