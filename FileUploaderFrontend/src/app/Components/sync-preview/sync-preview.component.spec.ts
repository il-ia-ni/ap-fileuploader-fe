import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncPreviewComponent } from './sync-preview.component';

describe('SyncPreviewComponent', () => {
  let component: SyncPreviewComponent;
  let fixture: ComponentFixture<SyncPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SyncPreviewComponent]
    });
    fixture = TestBed.createComponent(SyncPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
