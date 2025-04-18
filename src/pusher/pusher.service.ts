import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Pusher from 'pusher';

@Injectable()
export class PusherService implements OnModuleInit {
  private pusher: Pusher;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const appId = this.configService.get<string>('pusher.API_ID_PUSHER');
    const key = this.configService.get<string>('pusher.KEY_PUSHER');
    const secret = this.configService.get<string>('pusher.SECRET_PUSHER');
    const cluster = this.configService.get<string>('pusher.CLUSTER_PUSHER');

    if (!appId || !key || !secret || !cluster) {
      throw new Error('Pusher configuration is missing');
    }

    const options = {
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    };

    this.pusher = new Pusher(options);
  }

  async trigger(channel: string, event: string, data: any) {
    return this.pusher.trigger(channel, event, data);
  }
}
