import { Request } from 'express';
import { ProductDocument } from 'src/product/schema/product.schema';

export interface JwtPayload {
  id: string;
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
  user: UserDocument;
  token: string;
}

export type UserDocumentWithoutPassword = Omit<
  UserDocument,
  'password' | '_id'
>;
