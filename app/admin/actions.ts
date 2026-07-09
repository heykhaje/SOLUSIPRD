'use server';

import { createAdminClient } from '@/utils/supabase/admin';

export async function getAdminDashboardData() {
  const supabase = createAdminClient();

  try {
    // Fetch all profiles from public.profiles table
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return { success: false, error: error.message };
    }

    // Calculate metrics
    const totalUsers = profiles?.length || 0;
    
    // In a real app, revenue would be calculated from a transactions or subscriptions table.
    // For now, we simulate it based on total active users (e.g., 100k per user per month).
    const activeSubscribers = profiles?.filter(p => p.subscription_status === 'active').length || 0;
    // Just mock some revenue and token usage logic to make the dashboard look alive based on user count
    // Since this is 100% paid app, ideally we will have a real payment gateway soon.
    const revenue = totalUsers * 150000; // Mock Rp 150.000 per user
    
    // Sum tokens_used from all users
    const totalTokensUsed = profiles?.reduce((acc, curr) => acc + (curr.tokens_used || 0), 0) || 0;

    return {
      success: true,
      data: {
        profiles: profiles || [],
        metrics: {
          totalUsers,
          activeSubscribers,
          revenue,
          totalTokensUsed,
        },
      }
    };
  } catch (err: any) {
    console.error('Unexpected error in getAdminDashboardData:', err);
    return { success: false, error: err.message };
  }
}

export async function updateUserSubscription(userId: string, status: string | null) {
  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: status })
      .eq('id', userId);

    if (error) {
      console.error('Error updating subscription:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error in updateUserSubscription:', err);
    return { success: false, error: err.message };
  }
}
