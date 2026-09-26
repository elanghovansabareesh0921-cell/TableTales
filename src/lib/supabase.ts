import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project')
);

// Fallback or live Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Multi-tab broadcast channel for local realtime testing
export class LocalRealtimeChannel {
  private channel: BroadcastChannel | null = null;
  private channelName: string;

  constructor(channelName: string) {
    this.channelName = channelName;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(`tabletales_${channelName}`);
    }
  }

  send(event: string, payload: unknown) {
    if (this.channel) {
      this.channel.postMessage({ event, payload });
    }
  }

  on(callback: (event: string, payload: unknown) => void) {
    if (this.channel) {
      this.channel.onmessage = (e) => {
        if (e.data && e.data.event) {
          callback(e.data.event, e.data.payload);
        }
      };
    }
  }

  close() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}
