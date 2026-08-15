import { CategoryOption } from '../features/marketplace/types';
import { categoryOptions } from '../features/marketplace/mockData';

export interface MarketplaceConfig {
  productLabel: string;
  gradeOptions: CategoryOption[];
  unitOptions: string[];
}

export interface IConfigService {
  getMarketplaceConfig(): Promise<MarketplaceConfig>;
}

function delay(ms = 250) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// This is the direct implementation of the transcript's central ask: grade
// options, unit choices, and (eventually) other product types come from
// here, not from arrays imported statically into screens. Mock-backed
// today, but every consumer already goes through `useConfig()` — so
// swapping this file for a real endpoint later touches zero UI code.
class MockConfigService implements IConfigService {
  async getMarketplaceConfig(): Promise<MarketplaceConfig> {
    await delay();
    return {
      productLabel: 'Psyllium Husk (Isabgol)',
      gradeOptions: categoryOptions.filter((c) => c.id !== 'all'),
      unitOptions: ['Kg', 'Ton'],
    };
  }
}

export const configService: IConfigService = new MockConfigService();
