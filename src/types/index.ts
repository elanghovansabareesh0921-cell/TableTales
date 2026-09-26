export type VibeTheme = 'romantic' | 'family' | 'adventurous' | 'chill' | 'celebration';

export type AppFlowMode = 
  | 'landing' 
  | 'concierge' 
  | 'solo' 
  | 'group' 
  | 'checkout' 
  | 'confirmation' 
  | 'passport' 
  | 'review';

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  hours: string;
  hero_image_url: string;
  description: string;
  tagline: string;
  rating?: number;
  signature_vibe?: VibeTheme;
}

export interface SensoryNotes {
  aroma: string;
  texture: string;
  temperature: string;
  plating: string;
}

export interface OriginStory {
  region: string;
  chef_notes: string;
  cultural_context: string;
  heritage?: string;
}

export interface MenuItem {
  id: string;
  location_id: string;
  name: string;
  description: string;
  sensory_notes: SensoryNotes;
  origin_story: OriginStory;
  price: number;
  dietary_tags: string[];
  cuisine_region: string;
  serves_count: number;
  spice_level: number;
  image_url: string;
  is_signature?: boolean;
}

export interface ExtractedVibeContext {
  mood: string;
  party_size: number;
  occasion?: string;
  dietary_restrictions: string[];
  vibe_theme: VibeTheme;
  recommendation_note?: string;
}

export interface CartItem {
  id: string;
  menu_item: MenuItem;
  quantity: number;
  added_by: string;
  serves_recommended?: number;
}

export interface GroupRoomMember {
  id: string;
  room_id: string;
  user_id?: string;
  display_name: string;
  dietary_restrictions: string[];
  is_host: boolean;
  avatar_color: string;
  joined_at: string;
}

export interface GroupRoom {
  id: string;
  host_user_id: string;
  location_id: string;
  invite_code: string;
  status: 'active' | 'locked' | 'completed';
  members: GroupRoomMember[];
  cart: CartItem[];
  created_at: string;
}

export interface Reservation {
  id: string;
  session_id?: string;
  location_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  seating_preference: string;
  special_requests?: string;
  status: 'confirmed' | 'seated' | 'cancelled' | 'completed';
  created_at: string;
}

export interface Order {
  id: string;
  session_id?: string;
  room_id?: string;
  location_id: string;
  items: CartItem[];
  subtotal: number;
  tip_amount: number;
  tax_amount: number;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  split_type: 'single' | 'equal' | 'itemized';
  created_at: string;
}

export interface PassportStamp {
  id: string;
  user_id?: string;
  stamp_type: 'dish' | 'region' | 'vibe' | 'post_dining';
  menu_item_id?: string;
  location_id?: string;
  title: string;
  origin_region: string;
  badge_icon: string;
  earned_at: string;
  flavor_notes?: string;
}

export interface Review {
  id: string;
  order_id?: string;
  location_id: string;
  customer_name: string;
  food_rating: number;
  service_rating: number;
  vibe_rating: number;
  comment: string;
  vibe_theme_matched: VibeTheme;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
  extractedContext?: ExtractedVibeContext;
  suggestedAction?: 'explore_solo' | 'start_group' | 'view_menu';
}
