import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Profile } from './profile.service';

describe('Profile', () => {
  let service: Profile;
  let adminToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJsdWNhc2NhbmRyYWRleDFAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzAwMTAwMDQxfQ.aDhw1xkK55bhUQCm6tSxX4LYxq8hP_b3T8gYUS449F8";
  let userToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJsdWNhc2NhbmRyYWRleDFAZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJleHAiOjE3NjAwMTIxNTB9.dtKlfCqAuwaIUygAZnylw1nc1IXuJAnY8R_H1pGPlv0";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Profile]
    });
    service = TestBed.inject(Profile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true for a user with role ADMIN', () => {
    localStorage.setItem('token', adminToken);
    expect(service.canShowAdministracaoBtn()).toBe(true);
  });

  it('should return false for a user with role USER', () => {
    localStorage.setItem('token', userToken);
    expect(service.canShowAdministracaoBtn()).toBe(false);
  });

  it('should return false if no token is provided', () => {
    localStorage.removeItem('token');
    expect(service.canShowAdministracaoBtn()).toBe(false);
  });
});
