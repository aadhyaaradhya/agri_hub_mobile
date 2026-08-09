export type ProduceCategory =
  | 'all'
  | 'grains'
  | 'vegetables'
  | 'fruits'
  | 'inputs'
  | 'equipment';

export interface CategoryOption {
  id: ProduceCategory;
  label: string;
  emoji: string;
}

export interface ProduceItem {
  id: string;
  name: string;
  category: ProduceCategory;
  price: number;
  unit: string; // e.g. "Quintal", "Kg", "Bale"
  supplierName: string;
  location: string;
  moq: string; // Minimum Order Quantity
  rating: number;
  isOrganic: boolean;
  isVerified: boolean;
  stockQty: number;
  imageEmoji: string;
}

export interface SupplierStat {
  activeListings: number;
  monthlyRevenue: number;
  pendingOrders: number;
  totalDelivered: number;
}

export interface IncomingOrder {
  id: string;
  buyerName: string;
  produceName: string;
  quantity: string;
  totalPrice: number;
  status: 'Pending' | 'Accepted' | 'Shipped' | 'Delivered';
  date: string;
}
