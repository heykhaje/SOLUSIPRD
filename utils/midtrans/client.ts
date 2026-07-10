// @ts-ignore
import midtransClient from 'midtrans-client';

// Check production flag robustly (handles 'True', 'TRUE', 'true ', etc)
const isProdEnv = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION?.toLowerCase().trim() === 'true';

// Initialize Midtrans Snap client
export const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production' && isProdEnv,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
});

// Initialize Midtrans Core API (if needed for direct API calls without Snap UI)
export const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.NODE_ENV === 'production' && isProdEnv,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
});
