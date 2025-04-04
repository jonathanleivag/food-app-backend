import { Request } from 'express';
import { ProductDocument } from '../product/schema/product.schema';
import { UserDocument } from './user/schema/user.schema';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

export interface ProductFindAllPaginate {
  data: ProductDocument[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface LoginDocument {
  user: UserDocumentWithoutPassword;
  token: string;
}

export type UserDocumentWithoutPassword = Omit<
  UserDocument,
  'password' | '_id'
>;

export interface handleSuccessQuery {
  payment_id: string;
  preference_id: string;
}

export interface CreatePaymentDtoItem {
  title: string;
  unit_price: number;
  quantity: number;
  id: ObjectId;
  category_id: ObjectId;
  description: string;
}
