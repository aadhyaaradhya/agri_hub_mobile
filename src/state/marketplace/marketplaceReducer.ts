import {
  ProduceItem,
  IncomingOrder,
  Inquiry,
  SampleRequest,
} from '../../features/marketplace/types';

export interface MarketplaceState {
  listings: ProduceItem[];
  orders: IncomingOrder[];
  inquiries: Inquiry[];
  sampleRequests: SampleRequest[];
  isLoaded: boolean;
}

export const initialMarketplaceState: MarketplaceState = {
  listings: [],
  orders: [],
  inquiries: [],
  sampleRequests: [],
  isLoaded: false,
};

export type MarketplaceAction =
  | { type: 'LOADED'; payload: Omit<MarketplaceState, 'isLoaded'> }
  | { type: 'ADD_LISTING'; payload: ProduceItem }
  | { type: 'UPDATE_LISTING'; payload: ProduceItem }
  | { type: 'ADD_INQUIRY'; payload: Inquiry }
  | { type: 'ADD_SAMPLE_REQUEST'; payload: SampleRequest }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: IncomingOrder['status'] } };

export function marketplaceReducer(
  state: MarketplaceState,
  action: MarketplaceAction
): MarketplaceState {
  switch (action.type) {
    case 'LOADED':
      return { ...action.payload, isLoaded: true };
    case 'ADD_LISTING':
      return { ...state, listings: [action.payload, ...state.listings] };
    case 'UPDATE_LISTING':
      return {
        ...state,
        listings: state.listings.map((l) => (l.id === action.payload.id ? action.payload : l)),
      };
    case 'ADD_INQUIRY':
      return { ...state, inquiries: [action.payload, ...state.inquiries] };
    case 'ADD_SAMPLE_REQUEST':
      return { ...state, sampleRequests: [action.payload, ...state.sampleRequests] };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o
        ),
      };
    default:
      return state;
  }
}
