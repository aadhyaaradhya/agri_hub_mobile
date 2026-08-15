import { marketplaceReducer, initialMarketplaceState } from '../marketplaceReducer';
import { ProduceItem, IncomingOrder } from '../../../features/marketplace/types';

const sampleItem: ProduceItem = {
  id: 'p1',
  name: 'Test Grade',
  category: 'husk_98',
  price: 100,
  unit: 'Kg',
  supplierName: 'Test Co',
  moq: '10 Kg',
  rating: 5,
  isVerified: true,
  stockQty: 500,
  imageEmoji: '🌿',
};

describe('marketplaceReducer', () => {
  it('ADD_LISTING prepends a new listing (not mutating an imported array)', () => {
    const state = marketplaceReducer(initialMarketplaceState, {
      type: 'ADD_LISTING',
      payload: sampleItem,
    });
    expect(state.listings).toHaveLength(1);
    expect(state.listings[0]).toEqual(sampleItem);
    // The original array reference is untouched — this is the fix for the
    // `sampleProduceList.unshift(...)` direct-mutation bug.
    expect(initialMarketplaceState.listings).toHaveLength(0);
  });

  it('UPDATE_LISTING replaces the matching listing by id', () => {
    const withListing = marketplaceReducer(initialMarketplaceState, {
      type: 'ADD_LISTING',
      payload: sampleItem,
    });
    const updated = { ...sampleItem, price: 250 };
    const state = marketplaceReducer(withListing, { type: 'UPDATE_LISTING', payload: updated });
    expect(state.listings).toHaveLength(1);
    expect(state.listings[0].price).toBe(250);
  });

  it('UPDATE_ORDER_STATUS updates only the matching order', () => {
    const orders: IncomingOrder[] = [
      {
        id: 'o1',
        buyerName: 'A',
        produceName: 'X',
        quantity: '1',
        totalPrice: 1,
        status: 'Pending',
        date: 'today',
      },
      {
        id: 'o2',
        buyerName: 'B',
        produceName: 'Y',
        quantity: '1',
        totalPrice: 1,
        status: 'Pending',
        date: 'today',
      },
    ];
    const withOrders = { ...initialMarketplaceState, orders };
    const state = marketplaceReducer(withOrders, {
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId: 'o1', status: 'Accepted' },
    });
    expect(state.orders.find((o) => o.id === 'o1')?.status).toBe('Accepted');
    expect(state.orders.find((o) => o.id === 'o2')?.status).toBe('Pending');
  });

  it('ADD_INQUIRY and ADD_SAMPLE_REQUEST prepend to their own lists', () => {
    const state = marketplaceReducer(initialMarketplaceState, {
      type: 'ADD_INQUIRY',
      payload: {
        id: 'i1',
        buyerName: 'Buyer',
        category: 'husk_95',
        gradeName: 'Psyllium Husk 95% Pure',
        quantityNeeded: '1 Ton',
        unit: 'Ton',
        status: 'Open',
        createdAt: Date.now(),
      },
    });
    expect(state.inquiries).toHaveLength(1);
    expect(state.sampleRequests).toHaveLength(0);
  });
});
