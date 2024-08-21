import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../environment/environment';
import { VideoService } from './video.service';
import { IVideo } from 'src/shared/model/video.model';
import { Catalog } from 'src/shared/model/catalog.model';




describe('VideoService', () => {
  let service: VideoService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VideoService],
    });


    service = TestBed.inject(VideoService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests.
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('findAll', () => {
    it('should return all videos by institution', () => {
      const mockData = {
        qtTotal: 110,
        videoList: [
          {
            id: 142471,
            title: 'Sala de Reunião 04 do NTE',
            description: 'Sala de Reunião 04 do NTE',
            keywords: 'Sala de Reunião 04 do NTE',
            visibility: 'PUBLIC',
            duration: 561835,
            generateLibras: true,
            generateSubtitle: true,
            qtAccess: 41,
            qtLikes: 0,
            images: [
              {
                type: 'DEFAULT',
                href: 'https://eduplay.rnp.br/portal/assets/videos/images/1630091029232.png',
              },
            ],
            userOwner: {
              id: 30684,
              name: 'Fabio Ferreira de Oliveira',
            },
          },
        ],
      };


      service.findAll().subscribe((response) => {
        expect(response.body).toEqual(mockData);
      });


      const req = httpMock.expectOne(
        `${service.resourceUrl}?institution=${service.unbId}&limit=${service.limit}&order=${service.order}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('clientkey')).toBe(service.eduplayClientKey);


      req.flush(mockData);
    });
  });


  describe('findVideoById', () => {
    it('should return a video by ID', () => {
      const mockId = 185814;
      const mockData = {
        id: 185814,
        title: 'Tutorial - Etherpad',
        description:
          '<p>Tutorial do projeto Escolha Livre (escolhalivre.org.br) apresentando o Etherpad (como o pad.riseup.net), um software livre.</p>',
        visibility: 'PUBLIC',
        duration: 250367,
        embed:
          '<iframe width="671" height="377" src="https://eduplay.rnp.br/portal/video/embed/185814" frameborder="0" scrolling="no" allowfullscreen></iframe>',
        qtAccess: 28,
        qtLikes: 0,
      };


      service.findVideoById(mockId).subscribe((response) => {
        expect(response.body).toEqual(mockData);
      });


      const req = httpMock.expectOne(`${service.resourceUrl}/${mockId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('clientkey')).toBe(service.eduplayClientKey);


      req.flush(mockData);
    });
  });


  describe('addToWatchLater', () => {
    it('should add a video to the watch later list', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const mockResponse = { message: 'Added to watch later list' };


      service.addToWatchLater(mockVideoId, mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });


      const req = httpMock.expectOne(`${environment.videoAPIURL}/watch-later/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ video_id: mockVideoId, user_id: mockUserId });


      req.flush(mockResponse);
    });
  });


  describe('removeFromWatchLater', () => {
    it('should remove a video from the watch later list', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const mockResponse = { message: 'Removed from watch later list' };


      service.removeFromWatchLater(mockVideoId, mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/watch-later/${mockVideoId}?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('DELETE');


      req.flush(mockResponse);
    });
  });


  describe('checkWatchLater', () => {
    it('should check if a video is in the watch later list', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const mockResponse = { status: true };


      service.checkWatchLater(mockVideoId, mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/watch-later/status/${mockVideoId}?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });


  describe('getWatchLaterVideos', () => {
    it('should get all videos in the watch later list for a user', () => {
      const mockUserId = 'user123';
      const mockResponse = {
        videoList: [
          { video_id: '12345', status: true },
          { video_id: '67890', status: true },
        ],
      };


      service.getWatchLaterVideos(mockUserId).subscribe((response) => {
        expect(response.videoList.length).toBe(2);
        expect(response.videoList).toEqual(mockResponse.videoList);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/watch-later/?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });


  describe('addToFavorite', () => {
    it('should add a video to the favorite list', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const mockResponse = { message: 'Added to favorite list' };


      service.addToFavorite(mockVideoId, mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });


      const req = httpMock.expectOne(`${environment.videoAPIURL}/favorite/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ video_id: mockVideoId, user_id: mockUserId });


      req.flush(mockResponse);
    });
  });


  describe('removeFromFavorite', () => {
    it('should remove a video from the favorite list', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const mockResponse = { message: 'Removed from favorite list' };


      service.removeFromFavorite(mockVideoId, mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/favorite/${mockVideoId}?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('DELETE');


      req.flush(mockResponse);
    });
  });


  describe('checkFavorite', () => {
    it('should check if a video is in the favorite list', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const mockResponse = { statusfavorite: true };


      service.checkFavorite(mockVideoId, mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/favorite/status/${mockVideoId}?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });


  describe('getFavoriteVideos', () => {
    it('should get all videos in favorite list for a user', () => {
      const mockUserId = 'user123';
      const mockResponse = {
        videoList: [
          { video_id: '12345', status: true },
          { video_id: '67890', status: true },
        ],
      };


      service.getFavoriteVideos(mockUserId).subscribe((response) => {
        expect(response.videoList.length).toBe(2);
        expect(response.videoList).toEqual(mockResponse.videoList);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/favorite/?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });


  describe('checkRecord', () => {
    it('should check the user record history', () => {
      const mockUserId = 'user123';
      const mockResponse = {
        videos: {
          "12345": "2024-08-14 12:00:00",
          "67890": "2024-08-14 12:10:00",
        },
      };


      service.checkRecord(mockUserId).subscribe((response) => {
        expect(response.videos).toEqual(mockResponse.videos);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/record/get_record/?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });


  describe('addToRecord', () => {
    it('should add a video to the record history', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const currentDateTime = new Date().toLocaleString();
      const mockResponse = { message: 'Video added to record' };


      service.addToRecord(mockUserId, mockVideoId).subscribe((response) => {
        expect(response.message).toEqual(mockResponse.message);
      });


      const req = httpMock.expectOne(`${environment.videoAPIURL}/record/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        user_id: mockUserId,
        videos: { [mockVideoId]: currentDateTime },
      });


      req.flush(mockResponse);
    });
  });


describe('toggleTracking', () => {
  it('should toggle tracking on or off', () => {
    const mockUserId = 'user123';
    const mockTrack = true;
    const mockResponse = { message: 'Rastreamento habilitado' };


    service.toggleTracking(mockUserId, mockTrack).subscribe((response) => {
      expect(response.message).toEqual(mockResponse.message);
    });


    // Ajuste na verificação da URL
    const req = httpMock.expectOne(
      (request) =>
        request.url === `${environment.videoAPIURL}/record/toggle_tracking/` &&
        request.params.get('user_id') === mockUserId &&
        request.params.get('track') === mockTrack.toString()
    );


    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});




  describe('getRecordSorted', () => {
    it('should get the sorted record videos', () => {
      const mockUserId = 'user123';
      const mockAscending = true;
      const mockResponse = {
        videos: {
          "12345": "2024-08-14 12:00:00",
          "67890": "2024-08-14 12:10:00",
        },
      };


      service.getRecordSorted(mockUserId, mockAscending).subscribe((response) => {
        expect(response.videos).toEqual(mockResponse.videos);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/record/get_record_sorted/?user_id=${mockUserId}&ascending=${mockAscending}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });


  describe('checkTrackingStatus', () => {
    it('should check the tracking status for the user', () => {
      const mockUserId = 'user123';
      const mockResponse = { track_enabled: true };


      service.checkTrackingStatus(mockUserId).subscribe((response) => {
        expect(response.track_enabled).toBe(mockResponse.track_enabled);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/record/get_tracking_status/?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });
});


