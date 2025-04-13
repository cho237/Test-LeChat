export interface Category {
  id?: number;
  name: string;
}

export interface Article {
  id?: number;
  name: string;
  description: string;
  active: boolean;
  price: number;
  product: number;
  date_created?: Date;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  active: boolean;
  category: number;
  date_created?: Date;
}
