import { create } from 'zustand';
import { 
  VibeTheme, 
  AppFlowMode, 
  Location, 
  MenuItem, 
  CartItem, 
  GroupRoom, 
  GroupRoomMember, 
  ExtractedVibeContext, 
  PassportStamp, 
  Reservation, 
  Order, 
  Review 
} from '@/types';
import { INITIAL_LOCATIONS, INITIAL_MENU_ITEMS, INITIAL_PASSPORT_STAMPS } from '@/data/mockData';
import { LocalRealtimeChannel } from '@/lib/supabase';

interface AppState {
  // Navigation & Location
  selectedLocation: Location;
  locations: Location[];
  menuItems: MenuItem[];
  flowMode: AppFlowMode;
  
  // Vibe & AI Context
  vibeTheme: VibeTheme;
  mood: string;
  partySize: number;
  occasion: string;
  activeDietaryFilters: string[];
  
  // User Profile
  currentUserName: string;
  currentUserDietary: string[];
  
  // Cart & Orders
  cart: CartItem[];
  lastReservation: Reservation | null;
  lastOrder: Order | null;
  
  // Digital Passport & Reviews
  passportStamps: PassportStamp[];
  reviews: Review[];
  
  // Group Room
  groupRoom: GroupRoom | null;
  realtimeChannel: LocalRealtimeChannel | null;
  
  // Modal Overlays
  isConciergeOpen: boolean;
  isPassportOpen: boolean;
  isReviewModalOpen: boolean;
  
  // Actions
  setSelectedLocation: (location: Location) => void;
  setVibeTheme: (theme: VibeTheme) => void;
  setFlowMode: (mode: AppFlowMode) => void;
  setVibeContext: (context: ExtractedVibeContext) => void;
  toggleDietaryFilter: (filter: string) => void;
  clearDietaryFilters: () => void;
  setCurrentUser: (name: string, dietary: string[]) => void;
  
  // Cart Actions
  addToCart: (item: MenuItem, addedBy?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  applyFamilyPortions: (partySize: number) => void;
  
  // Passport Actions
  unlockPassportStamp: (stamp: Omit<PassportStamp, 'id' | 'earned_at'>) => void;
  
  // Group Room Actions
  createGroupRoom: (locationId: string, hostName: string, hostDietary?: string[]) => string;
  joinGroupRoom: (code: string, memberName: string, dietary: string[]) => boolean;
  addSimulatedGuest: (name: string, dietary: string[], avatarColor?: string) => void;
  lockGroupRoom: () => void;
  
  // Checkout & Review Actions
  createReservation: (reservation: Reservation) => void;
  createOrder: (order: Order) => void;
  submitReview: (review: Review) => void;
  
  // Modals
  setConciergeOpen: (open: boolean) => void;
  setPassportOpen: (open: boolean) => void;
  setReviewModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedLocation: INITIAL_LOCATIONS[0],
  locations: INITIAL_LOCATIONS,
  menuItems: INITIAL_MENU_ITEMS,
  flowMode: 'landing',
  
  vibeTheme: 'romantic',
  mood: 'Intimate date night with gentle candlelit warmth',
  partySize: 2,
  occasion: 'Anniversary',
  activeDietaryFilters: [],
  
  currentUserName: 'You',
  currentUserDietary: [],
  
  cart: [],
  lastReservation: null,
  lastOrder: null,
  
  passportStamps: INITIAL_PASSPORT_STAMPS,
  reviews: [],
  groupRoom: null,
  realtimeChannel: null,
  
  isConciergeOpen: false,
  isPassportOpen: false,
  isReviewModalOpen: false,
  
  setSelectedLocation: (location) => {
    set({ selectedLocation: location });
  },
  
  setVibeTheme: (theme) => {
    set({ vibeTheme: theme });
  },
  
  setFlowMode: (mode) => {
    set({ flowMode: mode });
  },
  
  setVibeContext: (context) => {
    set({
      vibeTheme: context.vibe_theme,
      mood: context.mood,
      partySize: context.party_size,
      occasion: context.occasion || get().occasion,
      activeDietaryFilters: context.dietary_restrictions,
    });
  },
  
  toggleDietaryFilter: (filter) => {
    const current = get().activeDietaryFilters;
    if (current.includes(filter)) {
      set({ activeDietaryFilters: current.filter(f => f !== filter) });
    } else {
      set({ activeDietaryFilters: [...current, filter] });
    }
  },
  
  clearDietaryFilters: () => {
    set({ activeDietaryFilters: [] });
  },
  
  setCurrentUser: (name, dietary) => {
    set({ currentUserName: name, currentUserDietary: dietary });
  },
  
  addToCart: (item, addedBy) => {
    const user = addedBy || get().currentUserName;
    const currentCart = get().cart;
    const existingIndex = currentCart.findIndex(c => c.menu_item.id === item.id);
    
    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = currentCart.map((c, i) => 
        i === existingIndex ? { ...c, quantity: c.quantity + 1 } : c
      );
    } else {
      updatedCart = [
        ...currentCart,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          menu_item: item,
          quantity: 1,
          added_by: user,
          serves_recommended: Math.max(1, Math.ceil((get().partySize * 0.75) / (item.serves_count || 1))),
        }
      ];
    }
    
    set({ cart: updatedCart });
    
    // Broadcast if in group room
    const room = get().groupRoom;
    if (room) {
      const updatedRoom: GroupRoom = { ...room, cart: updatedCart };
      set({ groupRoom: updatedRoom });
      get().realtimeChannel?.send('CART_UPDATE', updatedCart);
    }
  },
  
  removeFromCart: (itemId) => {
    const updatedCart = get().cart.filter(c => c.menu_item.id !== itemId);
    set({ cart: updatedCart });
    
    const room = get().groupRoom;
    if (room) {
      const updatedRoom: GroupRoom = { ...room, cart: updatedCart };
      set({ groupRoom: updatedRoom });
      get().realtimeChannel?.send('CART_UPDATE', updatedCart);
    }
  },
  
  updateCartQuantity: (itemId, delta) => {
    const currentCart = get().cart;
    const updatedCart = currentCart
      .map(c => {
        if (c.menu_item.id === itemId) {
          const newQty = c.quantity + delta;
          return newQty > 0 ? { ...c, quantity: newQty } : null;
        }
        return c;
      })
      .filter((c): c is CartItem => c !== null);
      
    set({ cart: updatedCart });
    
    const room = get().groupRoom;
    if (room) {
      const updatedRoom: GroupRoom = { ...room, cart: updatedCart };
      set({ groupRoom: updatedRoom });
      get().realtimeChannel?.send('CART_UPDATE', updatedCart);
    }
  },
  
  clearCart: () => {
    set({ cart: [] });
    const room = get().groupRoom;
    if (room) {
      const updatedRoom: GroupRoom = { ...room, cart: [] };
      set({ groupRoom: updatedRoom });
      get().realtimeChannel?.send('CART_UPDATE', []);
    }
  },
  
  applyFamilyPortions: (partySize) => {
    const updatedCart = get().cart.map(c => {
      // Heuristic: ~1.5 portions per 2 people = ~0.75 portion per person
      const recommendedQty = Math.max(1, Math.ceil((partySize * 0.75) / (c.menu_item.serves_count || 1)));
      return {
        ...c,
        quantity: recommendedQty,
        serves_recommended: recommendedQty,
      };
    });
    
    set({ cart: updatedCart });
    const room = get().groupRoom;
    if (room) {
      const updatedRoom: GroupRoom = { ...room, cart: updatedCart };
      set({ groupRoom: updatedRoom });
      get().realtimeChannel?.send('CART_UPDATE', updatedCart);
    }
  },
  
  unlockPassportStamp: (stampData) => {
    const existing = get().passportStamps;
    if (existing.some(s => s.title === stampData.title)) {
      return; // Already unlocked
    }
    
    const newStamp: PassportStamp = {
      ...stampData,
      id: `stamp-${Date.now()}`,
      earned_at: new Date().toISOString(),
    };
    
    set({ passportStamps: [newStamp, ...existing] });
  },
  
  createGroupRoom: (locationId, hostName, hostDietary = []) => {
    const inviteCode = `VIBE-${Math.floor(1000 + Math.random() * 9000)}`;
    const roomId = `room-${Date.now()}`;
    
    const hostMember: GroupRoomMember = {
      id: `member-${Date.now()}`,
      room_id: roomId,
      display_name: hostName || 'Host (You)',
      dietary_restrictions: hostDietary,
      is_host: true,
      avatar_color: '#f43f5e',
      joined_at: new Date().toISOString(),
    };
    
    const room: GroupRoom = {
      id: roomId,
      host_user_id: hostMember.id,
      location_id: locationId,
      invite_code: inviteCode,
      status: 'active',
      members: [hostMember],
      cart: [...get().cart],
      created_at: new Date().toISOString(),
    };
    
    const channel = new LocalRealtimeChannel(inviteCode);
    channel.on((event, payload) => {
      if (event === 'MEMBER_JOINED') {
        const member = payload as GroupRoomMember;
        set(state => ({
          groupRoom: state.groupRoom ? {
            ...state.groupRoom,
            members: [...state.groupRoom.members.filter(m => m.id !== member.id), member]
          } : null
        }));
      } else if (event === 'CART_UPDATE') {
        const newCart = payload as CartItem[];
        set(state => ({
          cart: newCart,
          groupRoom: state.groupRoom ? { ...state.groupRoom, cart: newCart } : null
        }));
      } else if (event === 'ORDER_LOCKED') {
        set(state => ({
          groupRoom: state.groupRoom ? { ...state.groupRoom, status: 'locked' } : null
        }));
      }
    });
    
    set({
      groupRoom: room,
      realtimeChannel: channel,
      currentUserName: hostName || 'Host (You)',
      partySize: 1,
      flowMode: 'group',
    });
    
    return inviteCode;
  },
  
  joinGroupRoom: (code, memberName, dietary) => {
    const cleanCode = code.trim().toUpperCase();
    const currentRoom = get().groupRoom;
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newMember: GroupRoomMember = {
      id: `member-${Date.now()}`,
      room_id: currentRoom?.id || `room-${cleanCode}`,
      display_name: memberName,
      dietary_restrictions: dietary,
      is_host: false,
      avatar_color: randomColor,
      joined_at: new Date().toISOString(),
    };
    
    if (currentRoom && currentRoom.invite_code === cleanCode) {
      const updatedMembers = [...currentRoom.members, newMember];
      set({
        groupRoom: { ...currentRoom, members: updatedMembers },
        currentUserName: memberName,
        currentUserDietary: dietary,
        flowMode: 'group',
      });
      get().realtimeChannel?.send('MEMBER_JOINED', newMember);
      return true;
    }
    
    // If joining fresh room by code
    const channel = new LocalRealtimeChannel(cleanCode);
    const mockRoom: GroupRoom = {
      id: `room-${cleanCode}`,
      host_user_id: 'host-1',
      location_id: get().selectedLocation.id,
      invite_code: cleanCode,
      status: 'active',
      members: [
        {
          id: 'host-1',
          room_id: `room-${cleanCode}`,
          display_name: 'Alex (Host)',
          dietary_restrictions: ['Nut-Free'],
          is_host: true,
          avatar_color: '#f43f5e',
          joined_at: new Date(Date.now() - 360000).toISOString(),
        },
        newMember
      ],
      cart: [...get().cart],
      created_at: new Date().toISOString(),
    };
    
    channel.on((event, payload) => {
      if (event === 'MEMBER_JOINED') {
        const member = payload as GroupRoomMember;
        set(state => ({
          groupRoom: state.groupRoom ? {
            ...state.groupRoom,
            members: [...state.groupRoom.members.filter(m => m.id !== member.id), member]
          } : null
        }));
      } else if (event === 'CART_UPDATE') {
        const newCart = payload as CartItem[];
        set(state => ({
          cart: newCart,
          groupRoom: state.groupRoom ? { ...state.groupRoom, cart: newCart } : null
        }));
      } else if (event === 'ORDER_LOCKED') {
        set(state => ({
          groupRoom: state.groupRoom ? { ...state.groupRoom, status: 'locked' } : null
        }));
      }
    });
    
    channel.send('MEMBER_JOINED', newMember);
    
    set({
      groupRoom: mockRoom,
      realtimeChannel: channel,
      currentUserName: memberName,
      currentUserDietary: dietary,
      flowMode: 'group',
    });
    
    return true;
  },
  
  addSimulatedGuest: (name, dietary, avatarColor) => {
    const room = get().groupRoom;
    if (!room) return;
    
    const colors = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4'];
    const newGuest: GroupRoomMember = {
      id: `sim-guest-${Date.now()}`,
      room_id: room.id,
      display_name: name,
      dietary_restrictions: dietary,
      is_host: false,
      avatar_color: avatarColor || colors[Math.floor(Math.random() * colors.length)],
      joined_at: new Date().toISOString(),
    };
    
    const updatedMembers = [...room.members, newGuest];
    const updatedRoom: GroupRoom = { ...room, members: updatedMembers };
    
    // Also auto-add a popular dish from this guest to make it dynamic!
    const locationDishes = get().menuItems.filter(m => m.location_id === get().selectedLocation.id);
    const safeDishes = locationDishes.filter(d => 
      !dietary.some(r => d.dietary_tags.map(t => t.toLowerCase()).includes(r.toLowerCase()))
    );
    const guestDish = safeDishes[Math.floor(Math.random() * safeDishes.length)] || locationDishes[0];
    
    set({ groupRoom: updatedRoom, partySize: updatedMembers.length });
    
    if (guestDish) {
      get().addToCart(guestDish, name);
    }
    
    get().realtimeChannel?.send('MEMBER_JOINED', newGuest);
  },
  
  lockGroupRoom: () => {
    const room = get().groupRoom;
    if (!room) return;
    
    const updatedRoom: GroupRoom = { ...room, status: 'locked' };
    set({ groupRoom: updatedRoom });
    get().realtimeChannel?.send('ORDER_LOCKED', {});
  },
  
  createReservation: (reservation) => {
    set({
      lastReservation: reservation,
      flowMode: 'confirmation',
    });
    
    // Unlock reservation passport stamp!
    get().unlockPassportStamp({
      stamp_type: 'region',
      title: `${get().selectedLocation.name} Guest of Honor`,
      origin_region: get().selectedLocation.city,
      badge_icon: '🏛️',
      flavor_notes: `Confirmed table for ${reservation.party_size} diners at ${reservation.reservation_time}.`,
    });
  },
  
  createOrder: (order) => {
    set({
      lastOrder: order,
      flowMode: 'confirmation',
    });
    
    // Unlock dish passport stamps for items ordered!
    order.items.forEach(item => {
      get().unlockPassportStamp({
        stamp_type: 'dish',
        title: item.menu_item.name,
        origin_region: item.menu_item.cuisine_region,
        badge_icon: '✨',
        flavor_notes: item.menu_item.sensory_notes.aroma,
      });
    });
  },
  
  submitReview: (review) => {
    set(state => ({
      reviews: [review, ...state.reviews],
      isReviewModalOpen: false,
    }));
    
    // Unlock Vibe Connoisseur passport stamp
    get().unlockPassportStamp({
      stamp_type: 'vibe',
      title: 'Vibe Connoisseur',
      origin_region: get().selectedLocation.name,
      badge_icon: '🏆',
      flavor_notes: `Rated ${review.vibe_rating}/5 for ${review.vibe_theme_matched} atmosphere accuracy.`,
    });
  },
  
  setConciergeOpen: (open) => set({ isConciergeOpen: open }),
  setPassportOpen: (open) => set({ isPassportOpen: open }),
  setReviewModalOpen: (open) => set({ isReviewModalOpen: open }),
}));
