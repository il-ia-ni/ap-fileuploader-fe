import { TestBed } from '@angular/core/testing';

import { ExceluploaderService } from './exceluploader.service';

describe('ExceluploaderService', () => {
  let service: ExceluploaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExceluploaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
