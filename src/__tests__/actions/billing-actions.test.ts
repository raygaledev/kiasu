import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  mockPrisma,
  mockAuthenticated,
  mockUnauthenticated,
  TEST_USER,
} from '../helpers/mocks';

const mockSubscriptionsList = vi.fn();
const mockSubscriptionsUpdate = vi.fn();

vi.mock('@/lib/stripe/client', () => ({
  stripe: {
    subscriptions: {
      list: (...args: unknown[]) => mockSubscriptionsList(...args),
      update: (...args: unknown[]) => mockSubscriptionsUpdate(...args),
    },
  },
}));

import { getSubscriptionInfo, cancelSubscription } from '@/app/billing/actions';

function makeSubscription(overrides: Record<string, unknown> = {}) {
  return {
    id: 'sub_123',
    cancel_at_period_end: false,
    cancel_at: null,
    items: {
      data: [{ current_period_end: 1800000000 }],
    },
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockSubscriptionsList.mockResolvedValue({ data: [] });
});

// ── getSubscriptionInfo ──────────────────────────────────────

describe('getSubscriptionInfo', () => {
  it('returns null when not authenticated', async () => {
    mockUnauthenticated();
    const result = await getSubscriptionInfo();
    expect(result).toBeNull();
  });

  it('returns null when user has no stripeCustomerId', async () => {
    mockAuthenticated(TEST_USER);
    mockPrisma.user.findUnique.mockResolvedValue({ stripeCustomerId: null });

    const result = await getSubscriptionInfo();
    expect(result).toBeNull();
  });

  it('returns null when no active subscription found', async () => {
    mockAuthenticated(TEST_USER);
    mockPrisma.user.findUnique.mockResolvedValue({
      stripeCustomerId: 'cus_123',
    });
    mockSubscriptionsList.mockResolvedValue({ data: [] });

    const result = await getSubscriptionInfo();
    expect(result).toBeNull();
  });

  it('returns subscription info for an active subscription', async () => {
    mockAuthenticated(TEST_USER);
    mockPrisma.user.findUnique.mockResolvedValue({
      stripeCustomerId: 'cus_123',
    });
    mockSubscriptionsList.mockResolvedValue({
      data: [makeSubscription()],
    });

    const result = await getSubscriptionInfo();

    expect(result).not.toBeNull();
    expect(result!.cancelAtPeriodEnd).toBe(false);
    expect(result!.cancelAt).toBeNull();
    expect(result!.currentPeriodEnd).toEqual(new Date(1800000000 * 1000));
  });

  it('returns cancelAtPeriodEnd true and end date when subscription is set to cancel', async () => {
    mockAuthenticated(TEST_USER);
    mockPrisma.user.findUnique.mockResolvedValue({
      stripeCustomerId: 'cus_123',
    });
    mockSubscriptionsList.mockResolvedValue({
      data: [
        makeSubscription({
          cancel_at_period_end: true,
          cancel_at: 1800000000,
        }),
      ],
    });

    const result = await getSubscriptionInfo();

    expect(result!.cancelAtPeriodEnd).toBe(true);
    expect(result!.cancelAt).toEqual(new Date(1800000000 * 1000));
  });

  it('queries Stripe with the correct customer and status', async () => {
    mockAuthenticated(TEST_USER);
    mockPrisma.user.findUnique.mockResolvedValue({
      stripeCustomerId: 'cus_abc',
    });

    await getSubscriptionInfo();

    expect(mockSubscriptionsList).toHaveBeenCalledWith({
      customer: 'cus_abc',
      status: 'active',
      limit: 1,
    });
  });
});

// ── cancelSubscription ───────────────────────────────────────

describe('cancelSubscription', () => {
  it('returns error when not authenticated', async () => {
    mockUnauthenticated();
    const result = await cancelSubscription();
    expect(result).toEqual({ error: 'Not authenticated' });
  });

  it('returns error when user has no stripeCustomerId', async () => {
    mockAuthenticated(TEST_USER);
    mockPrisma.user.findUnique.mockResolvedValue({ stripeCustomerId: null });

    const result = await cancelSubscription();
    expect(result).toEqual({ error: 'No active subscription' });
  });

  it('returns error when no active subscription found', async () => {
    mockAuthenticated(TEST_USER);
    mockPrisma.user.findUnique.mockResolvedValue({
      stripeCustomerId: 'cus_123',
    });
    mockSubscriptionsList.mockResolvedValue({ data: [] });

    const result = await cancelSubscription();
    expect(result).toEqual({ error: 'No active subscription' });
  });

  it('calls stripe.subscriptions.update with cancel_at_period_end: true', async () => {
    mockAuthenticated(TEST_USER);
    mockPrisma.user.findUnique.mockResolvedValue({
      stripeCustomerId: 'cus_123',
    });
    mockSubscriptionsList.mockResolvedValue({
      data: [makeSubscription({ id: 'sub_abc' })],
    });
    mockSubscriptionsUpdate.mockResolvedValue(
      makeSubscription({ id: 'sub_abc', cancel_at_period_end: true }),
    );

    await cancelSubscription();

    expect(mockSubscriptionsUpdate).toHaveBeenCalledWith('sub_abc', {
      cancel_at_period_end: true,
    });
  });

  it('returns cancelAt date derived from the updated subscription item period end', async () => {
    mockAuthenticated(TEST_USER);
    mockPrisma.user.findUnique.mockResolvedValue({
      stripeCustomerId: 'cus_123',
    });
    mockSubscriptionsList.mockResolvedValue({
      data: [makeSubscription()],
    });
    mockSubscriptionsUpdate.mockResolvedValue(
      makeSubscription({ cancel_at_period_end: true }),
    );

    const result = await cancelSubscription();

    expect(result).toEqual({ cancelAt: new Date(1800000000 * 1000) });
  });
});
