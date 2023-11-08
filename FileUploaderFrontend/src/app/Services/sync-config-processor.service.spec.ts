import { TestBed } from '@angular/core/testing';

import { SyncConfigProcessorService } from './sync-config-processor.service';

describe('SyncConfigProcessorService', () => {
  let service: SyncConfigProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncConfigProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
