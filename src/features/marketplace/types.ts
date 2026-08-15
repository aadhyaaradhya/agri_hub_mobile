export type ProduceCategory = 'all' | 'husk_85' | 'husk_95' | 'husk_98' | 'husk_99' | 'custom';

export interface CategoryOption {
  id: ProduceCategory;
  label: string;
  emoji: string;
  gradeName?: string;
}

export interface ProduceItem {
  id: string;
  name: string;
  grade?: string;
  category: ProduceCategory;
  price: number;
  unit: string; // "Kg", "Ton"
  supplierName: string;
  moq: string; // Order quantity / MOQ
  rating: number;
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

// A buyer-submitted requirement — the mirror of a supplier's `ProduceItem`
// listing. Powers the supplier-side "Buyer Demand" aggregate, the same way
// listings power the buyer-side "Available Supply" aggregate.
export interface Inquiry {
  id: string;
  buyerName: string;
  buyerCompany?: string;
  category: ProduceCategory;
  gradeName: string;
  quantityNeeded: string;
  unit: string;
  notes?: string;
  status: 'Open' | 'Fulfilled' | 'Closed';
  createdAt: number;
}

export interface SampleRequest {
  id: string;
  purityGrade: string; // e.g. '85%', '95%', '98%', '99%'
  companyName: string;
  gstNumber: string;
  sampleQuantity: string;
  deliveryAddress: string;
  contactNumber: string;
  status: 'Pending' | 'Dispatched' | 'Delivered';
  createdAt: number;
}
