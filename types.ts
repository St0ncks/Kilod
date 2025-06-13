
export interface MerchandiseItem {
  id: string; // for unique key in lists
  itemCode: string; // 8 digits
  itemName: string;
}

export interface Order {
  id: string; // Sequential Identification Code, e.g., ORD-0001
  firstName: string;
  lastName: string;
  code: number | string; // Integer code - allow string for input flexibility initially
  pickupDate: string; // ISO date string YYYY-MM-DD
  merchandise: MerchandiseItem[];
  createdAt: string; // ISO string for timestamp
}

export enum ViewMode {
  LIST,
  FORM
}
