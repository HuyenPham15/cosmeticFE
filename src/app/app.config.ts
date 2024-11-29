import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { StompConfig, StompRService } from '@stomp/ng2-stompjs';
import { WebsocketService } from './services/websocket.service';
import { WishlistService } from './services/wishlist.service';
const stompConfig: StompConfig = {
  url: 'ws://localhost:8080/ws', // WebSocket URL
  headers: {},
  heartbeat_in: 0,
  heartbeat_out: 20000,
  reconnect_delay: 5000,
  debug: true
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '918267271648-athcs0cii2r13thjbegj2js0sssi6cl8.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('600719199015029')
          }
        ],
        onError: (err) => {
          console.error('Social Auth Error:', err);
        }
      } as SocialAuthServiceConfig,
    },
    WebsocketService,
    StompRService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
    ,
    WishlistService
  ]
};
