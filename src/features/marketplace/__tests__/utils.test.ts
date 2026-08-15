import { toKg, formatKgAsDisplayUnit, totalStockByCategory } from '../utils';
import { ProduceItem } from '../types';

describe('marketplace utils', () => {
  it('toKg converts Tons to Kg', () => {
    expect(toKg(2, 'Ton')).toBe(2000);
    expect(toKg(500, 'Kg')).toBe(500);
  });

  it('formatKgAsDisplayUnit switches to Tons above 1000kg', () => {
    expect(formatKgAsDisplayUnit(500)).toBe('500 Kg');
    expect(formatKgAsDisplayUnit(1000)).toBe('1 Ton');
    expect(formatKgAsDisplayUnit(2500)).toBe('2.5 Tons');
  });

  it('totalStockByCategory sums mixed Kg/Ton units correctly instead of naively adding raw numbers', () => {
    const listings: ProduceItem[] = [
      {
        id: '1',
        name: 'A',
        category: 'husk_98',
        price: 1,
        unit: 'Kg',
        supplierName: 'S',
        moq: '1',
        rating: 5,
        isVerified: true,
        stockQty: 5000,
        imageEmoji: '🌿',
      },
      {
        id: '2',
        name: 'B',
        category: 'husk_98',
        price: 1,
        unit: 'Ton',
        supplierName: 'S',
        moq: '1',
        rating: 5,
        isVerified: true,
        stockQty: 3,
        imageEmoji: '🌿',
      },
      {
        id: '3',
        name: 'C',
        category: 'husk_85',
        price: 1,
        unit: 'Kg',
        supplierName: 'S',
        moq: '1',
        rating: 5,
        isVerified: true,
        stockQty: 100,
        imageEmoji: '🌱',
      },
    ];
    // 5000 Kg + 3 Ton (3000 Kg) = 8000 Kg = 8 Tons — naively adding the raw
    // numbers (5000 + 3 = 5003) would be meaningless; this must normalize
    // to Kg first, which is exactly the bug this helper was written to fix.
    expect(totalStockByCategory(listings, 'husk_98')).toBe('8 Tons');
    expect(totalStockByCategory(listings, 'husk_85')).toBe('100 Kg');
  });
});
