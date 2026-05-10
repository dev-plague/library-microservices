export interface InventoryStatus {
  bookId: string;
  quantity: number;
  status: 'available' | 'out_of_stock' | 'discontinued';
}

export interface Stock {
  id: string;
  bookId: string;
  quantity: number;
}