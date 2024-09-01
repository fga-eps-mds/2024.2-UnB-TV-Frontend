import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable  } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { IVideo } from 'src/shared/model/video.model';
import jwt_decode from 'jwt-decode';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public recommendedVideosCountSource = new BehaviorSubject<number>(0);
  public recommendedVideosCount$ = this.recommendedVideosCountSource.asObservable();
  public userId: string = '';
  public recommendedVideos: IVideo[] = [];
  private videoServiceApiURL = environment.videoAPIURL; // URL base correta

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  updateRecommendedVideosCount(count: number) {
    this.recommendedVideosCountSource.next(count);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  setUserIdFromToken(token: string) {
    const decodedToken: any = jwt_decode(token);
    this.userId = decodedToken.id;
  }

  fetchRecommendedVideosCount(userId: string): Observable<any> {
    return this.http.get<{ recommend_videos: IVideo[] }>(`${this.videoServiceApiURL}/recommendation/get_recommendation_record/`, {
      params: { user_id: userId }
    });
  }
}

