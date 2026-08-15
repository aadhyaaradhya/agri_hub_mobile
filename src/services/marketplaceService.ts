import { ProduceItem, IncomingOrder, Inquiry, SampleRequest } from '../features/marketplace/types';
import { sampleProduceList, sampleIncomingOrders } from '../features/marketplace/mockData';
import { storage, STORAGE_KEYS } from './storageService';

export interface MarketplaceSnapshot {
  listings: ProduceItem[];
  orders: IncomingOrder[];
  inquiries: Inquiry[];
  sampleRequests: SampleRequest[];
}

export interface IMarketplaceService {
  load(): Promise<MarketplaceSnapshot>;
  addListing(item: ProduceItem): Promise<void>;
  updateListing(item: ProduceItem): Promise<void>;
  addInquiry(inquiry: Inquiry): Promise<void>;
  addSampleRequest(request: SampleRequest): Promise<void>;
  updateOrderStatus(orderId: string, status: IncomingOrder['status']): Promise<void>;
}

function delay(ms = 300) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function readSnapshot(): Promise<MarketplaceSnapshot> {
  const stored = await storage.get<MarketplaceSnapshot>(STORAGE_KEYS.marketplace);
  if (stored) return stored;
  // First run: seed local storage from the bundled sample data so there's
  // something to look at before any real listing/inquiry has been added.
  const seeded: MarketplaceSnapshot = {
    listings: sampleProduceList,
    orders: sampleIncomingOrders,
    inquiries: [],
    sampleRequests: [],
  };
  await storage.set(STORAGE_KEYS.marketplace, seeded);
  return seeded;
}

async function writeSnapshot(snapshot: MarketplaceSnapshot): Promise<void> {
  await storage.set(STORAGE_KEYS.marketplace, snapshot);
}

// Mock, local-only implementation backed by AsyncStorage instead of a
// mutated module-level array — this is the fix for the direct-mutation bug
// (`sampleProduceList.unshift(...)`) and the reason data now survives an
// app restart. `IMarketplaceService` is the stable seam a real API swaps
// into later.
class MockMarketplaceService implements IMarketplaceService {
  async load() {
    await delay();
    return readSnapshot();
  }

  async addListing(item: ProduceItem) {
    await delay(200);
    const snapshot = await readSnapshot();
    snapshot.listings = [item, ...snapshot.listings];
    await writeSnapshot(snapshot);
  }

  async updateListing(item: ProduceItem) {
    await delay(200);
    const snapshot = await readSnapshot();
    snapshot.listings = snapshot.listings.map((l) => (l.id === item.id ? item : l));
    await writeSnapshot(snapshot);
  }

  async addInquiry(inquiry: Inquiry) {
    await delay(200);
    const snapshot = await readSnapshot();
    snapshot.inquiries = [inquiry, ...snapshot.inquiries];
    await writeSnapshot(snapshot);
  }

  async addSampleRequest(request: SampleRequest) {
    await delay(200);
    const snapshot = await readSnapshot();
    snapshot.sampleRequests = [request, ...snapshot.sampleRequests];
    await writeSnapshot(snapshot);
  }

  async updateOrderStatus(orderId: string, status: IncomingOrder['status']) {
    await delay(200);
    const snapshot = await readSnapshot();
    snapshot.orders = snapshot.orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    await writeSnapshot(snapshot);
  }
}

export const marketplaceService: IMarketplaceService = new MockMarketplaceService();
