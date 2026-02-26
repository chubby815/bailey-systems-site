import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

// Product price mappings (replace with your actual Stripe Price IDs)
const PRICE_MAP: Record<string, string> = {
  'price_bento_template': 'price_1234567890', // Replace with actual Stripe Price ID
  'price_ecommerce_pro': 'price_1234567891',
  'price_saas_dashboard': 'price_1234567892',
  'price_portfolio_site': 'price_1234567893',
  'price_blog_cms': 'price_1234567894',
  'price_booking_system': 'price_1234567895',
  'price_landing_pro': 'price_1234567896',
  'price_admin_panel': 'price_1234567897',
};

export async function POST(request: Request) {
  try {
    const { priceId, productName } = await request.json();

    if (!priceId || !productName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the actual Stripe Price ID
    const stripePriceId = PRICE_MAP[priceId];

    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/store?success=true&product=${encodeURIComponent(productName)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/store?canceled=true`,
      metadata: {
        productName,
        priceId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
