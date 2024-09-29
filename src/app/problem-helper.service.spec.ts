import { TestBed } from '@angular/core/testing';

import { ProblemHelperService } from './problem-helper.service';

describe('ProblemHelperService', () => {
  let service: ProblemHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProblemHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
