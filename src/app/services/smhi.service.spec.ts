import { TestBed } from '@angular/core/testing';
import { SmhiService } from './smhi.service';

describe('SmhiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmhiService = TestBed.get(SmhiService);
    expect(service).toBeTruthy();
  });
});
