import { ProduceItem } from './types';

const KG_PER_TON = 1000;

// `ProduceItem.unit` varies per listing ('Kg' or 'Ton'), so summing raw
// `stockQty` across mixed units silently produces a meaningless number
// (5000 Kg + 3 Ton !== 5003 of anything). Normalize to Kg before summing.
export function toKg(quantity: number, unit: string): number {
  return unit === 'Ton' ? quantity * KG_PER_TON : quantity;
}

export function formatKgAsDisplayUnit(totalKg: number): string {
  if (totalKg <= 0) return '0 Kg';
  if (totalKg >= KG_PER_TON) {
    const tons = totalKg / KG_PER_TON;
    const rounded = Number.isInteger(tons) ? tons : Math.round(tons * 10) / 10;
    return `${rounded} Ton${rounded === 1 ? '' : 's'}`;
  }
  return `${totalKg.toLocaleString('en-IN')} Kg`;
}

export function totalStockByCategory(listings: ProduceItem[], category: string): string {
  const totalKg = listings
    .filter((item) => item.category === category)
    .reduce((sum, item) => sum + toKg(item.stockQty, item.unit), 0);
  return formatKgAsDisplayUnit(totalKg);
}
