'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { stripe } from '@/lib/stripe/client';

const PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  yearly: process.env.STRIPE_PRICE_YEARLY!,
};

export async function getSubscriptionInfo() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { stripeCustomerId: true },
  });

  if (!dbUser?.stripeCustomerId) return null;

  const subscriptions = await stripe.subscriptions.list({
    customer: dbUser.stripeCustomerId,
    status: 'active',
    limit: 1,
  });

  const sub = subscriptions.data[0];
  if (!sub) return null;

  const periodEnd = sub.items.data[0]?.current_period_end ?? sub.cancel_at;

  return {
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : null,
    currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
  };
}

export async function cancelSubscription() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { stripeCustomerId: true },
  });

  if (!dbUser?.stripeCustomerId) return { error: 'No active subscription' };

  const subscriptions = await stripe.subscriptions.list({
    customer: dbUser.stripeCustomerId,
    status: 'active',
    limit: 1,
  });

  const sub = subscriptions.data[0];
  if (!sub) return { error: 'No active subscription' };

  const updated = await stripe.subscriptions.update(sub.id, {
    cancel_at_period_end: true,
  });

  const periodEnd =
    updated.items.data[0]?.current_period_end ?? updated.cancel_at;

  return {
    cancelAt: periodEnd ? new Date(periodEnd * 1000) : null,
  };
}

export async function createCheckoutSession(billing: 'monthly' | 'yearly') {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { stripeCustomerId: true, email: true },
  });

  // Reuse existing Stripe customer or create a new one
  let customerId = dbUser.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: dbUser.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: PRICES[billing], quantity: 1 }],
    success_url: `${baseUrl}/dashboard?upgraded=true`,
    cancel_url: `${baseUrl}/dashboard`,
    metadata: { userId: user.id },
  });

  redirect(session.url!);
}
