import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Webhook payload from Midtrans
    const {
      order_id,
      status_code,
      gross_amount,
      transaction_status,
      signature_key
    } = data;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';

    // Verify signature key to ensure request is from Midtrans
    const hash = crypto.createHash('sha512');
    hash.update(`${order_id}${status_code}${gross_amount}${serverKey}`);
    const generatedSignature = hash.digest('hex');

    if (signature_key !== generatedSignature) {
      console.error('Invalid signature key from Midtrans');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process transaction status
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      // Payment successful
      // orderId format is SUB-{userId8chars}-{timestamp}
      // However, we don't know the exact full userId just from 8 chars.
      // We should ideally pass the exact userId in order_id or custom_field1.
      
      // Since order_id is SUB-xxxxx, we should just query profiles to find if there's a custom logic, 
      // but wait, we need the full user_id to update profiles safely.
      // Midtrans allows custom_field1, custom_field2, etc. Let's assume we update checkout API to send custom_field1 as userId
      const userId = data.custom_field1;
      const planId = data.custom_field2 || 'active'; // fallback to active if custom_field2 is somehow missing

      if (!userId) {
         console.error('UserId not found in custom_field1 of webhook payload');
         return NextResponse.json({ error: 'User ID missing in payload' }, { status: 400 });
      }

      const supabase = createAdminClient();
      
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: planId })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user subscription status:', error);
        return NextResponse.json({ error: 'DB Update Failed' }, { status: 500 });
      }

      console.log(`Successfully activated ${planId} subscription for user: ${userId}`);
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
       // Payment failed or expired, we don't need to do anything since it's inactive by default
       console.log(`Payment failed/expired for order: ${order_id}`);
    }

    return NextResponse.json({ status: 'OK' });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
