import React, { createContext, useContext, useEffect, useReducer, useMemo } from 'react';
import {
  ProduceItem,
  IncomingOrder,
  Inquiry,
  SampleRequest,
} from '../../features/marketplace/types';
import { marketplaceService } from '../../services/marketplaceService';
import {
  marketplaceReducer,
  initialMarketplaceState,
  MarketplaceState,
} from './marketplaceReducer';

interface MarketplaceContextType extends MarketplaceState {
  addListing: (item: ProduceItem) => Promise<void>;
  updateListing: (item: ProduceItem) => Promise<void>;
  addInquiry: (inquiry: Inquiry) => Promise<void>;
  addSampleRequest: (request: SampleRequest) => Promise<void>;
  updateOrderStatus: (orderId: string, status: IncomingOrder['status']) => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

// Single source of truth for listings/inquiries/sample-requests/orders —
// replaces `SupplierDashboardScreen` mutating the imported `mockData`
// array directly. Updates apply to local state immediately (optimistic —
// there's no real network round-trip to fail against yet) and persist via
// `marketplaceService` underneath.
export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(marketplaceReducer, initialMarketplaceState);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const snapshot = await marketplaceService.load();
        if (isMounted) {
          dispatch({ type: 'LOADED', payload: snapshot });
        }
      } catch (err) {
        console.error('Failed to load marketplace snapshot:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const addListing = async (item: ProduceItem) => {
    dispatch({ type: 'ADD_LISTING', payload: item });
    await marketplaceService.addListing(item);
  };
  const updateListing = async (item: ProduceItem) => {
    dispatch({ type: 'UPDATE_LISTING', payload: item });
    await marketplaceService.updateListing(item);
  };
  const addInquiry = async (inquiry: Inquiry) => {
    dispatch({ type: 'ADD_INQUIRY', payload: inquiry });
    await marketplaceService.addInquiry(inquiry);
  };
  const addSampleRequest = async (request: SampleRequest) => {
    dispatch({ type: 'ADD_SAMPLE_REQUEST', payload: request });
    await marketplaceService.addSampleRequest(request);
  };
  const updateOrderStatus = async (orderId: string, status: IncomingOrder['status']) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
    await marketplaceService.updateOrderStatus(orderId, status);
  };

  const value = useMemo<MarketplaceContextType>(
    () => ({
      ...state,
      addListing,
      updateListing,
      addInquiry,
      addSampleRequest,
      updateOrderStatus,
    }),
    [state]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
};

export const useMarketplace = (): MarketplaceContextType => {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used within a MarketplaceProvider');
  return ctx;
};
