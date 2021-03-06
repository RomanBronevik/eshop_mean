export interface Translations {
  lang: string;
  keys: {
    [key: string]: string;
  }
  _id?: string;
}

export interface Product {
  _id?                : string;
  title               : string;
  titleUrl            : string;
  description         : string;
  descriptionFull     : string;
  categories          : string[];
  tags                : string[];
  regularPrice        : number;
  salePrice           : number;
  visibility          : boolean;
  onSale              : boolean;
  stock               : string;
  shipping?           : string;
  mainImage           : { url: string; name: string }
  images              : string[];
  _user?              : any;
  dateAdded?          : any;
}

export interface Cart {
  totalQty    : number;
  totalPrice  : number;
  items       : {
    id? : string;
    item: Product
    price: number;
    qty  : number;
  }[]
}

export interface Category {
  title     : string;
  titleUrl  : string;
}

export interface Pagination {
  total     : number;
  limit     : number;
  page      : number;
  pages     : number;
  range?    : number[]
}

export interface User {
  email       : string;
  id?         : string;
  roles?      : string[];
  accessToken?: string;
}

export interface Address {
  name: string;
  line1: string;
  line2: string;
  city: string;
  zip: string;
  country: string;
  region?: string;
}

export enum OrderStatus {
  NEW = 'NEW',
  PAID = 'PAID',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface Order {
  _id?: string;
  orderId: string;
  addresses: Address[]
  amount: number;
  amount_refunded: number;
  currency: string;
  cart: Cart;
  cardId?: string;
  customerEmail: string;
  dateAdded: any;
  type: string;
  description?: string;
  notes? : string;
  outcome?: {seller_message: string; }
  status: OrderStatus;
  __v?: number;
  _user?: string;
}
