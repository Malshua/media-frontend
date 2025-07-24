import { JwtPayload } from 'jsonwebtoken';

export interface TransactionDetailsProps {
  details: JwtPayload | null;
  api_url: string | undefined;
  secretKey: string | undefined;
  iv: string | undefined;
}
