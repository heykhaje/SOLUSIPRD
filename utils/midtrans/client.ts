import midtransClient from 'midtrans-client';

// Initialize Midtrans Snap client
export const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production' && process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
});

// Initialize Midtrans Core API (if needed for direct API calls without Snap UI)
export const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.NODE_ENV === 'production' && process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
});
