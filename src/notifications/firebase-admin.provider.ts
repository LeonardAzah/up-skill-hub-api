import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
export const firebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: configService.get<string>('PROJECT_ID'),
        clientEmail: configService.get<string>('CLIENT_EMAIL'),
        privateKey: configService
          .get<string>('PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'),
      }),
    });
  },
};
