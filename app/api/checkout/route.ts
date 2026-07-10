import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { snap } from '@/utils/midtrans/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId } = body;
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // DEBUGGING INFO (will show in Vercel Logs)
    console.log('--- MIDTRANS DEBUG ---');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('IS_PRODUCTION_ENV:', process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION);
    console.log('SERVER_KEY_PREFIX:', process.env.MIDTRANS_SERVER_KEY ? process.env.MIDTRANS_SERVER_KEY.substring(0, 10) + '...' : 'MISSING');
    console.log('----------------------');

    let amount = 0;
    let planName = '';

    if (planId === 'basic') {
      amount = 50000;
      planName = 'Basic (1 Minggu)';
    } else if (planId === 'pro') {
      amount = 100000;
      planName = 'Pro (1 Bulan)';
    } else if (planId === 'max') {
      amount = 130000;
      planName = 'Max (1 Bulan)';
    } else {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
    }

    // Prepare transaction parameters for Midtrans Snap
    // order_id must be unique. We prepend user_id and timestamp.
    const orderId = `SUB-${user.id.substring(0, 8)}-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      customer_details: {
        first_name: user.user_metadata?.full_name || 'Khaje User',
        email: user.email,
      },
      custom_field1: user.id,
      custom_field2: planId,
      item_details: [{
        id: `PLAN-${planId.toUpperCase()}`,
        price: amount,
        quantity: 1,
        name: planName
      }]
    };

    // Create Snap transaction token
    const transaction = await snap.createTransaction(parameter);

    // Return the token to the frontend
    return NextResponse.json({ token: transaction.token, orderId });

  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
