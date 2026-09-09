import { NextRequest, NextResponse } from "next/server";

const IntaSend = require("intasend-node");

const intasend = new IntaSend(
  process.env.INSTASEND_PUBLISHABLE_KEY!,
  process.env.INSTASEND_SECRET_KEY!,
  process.env.NODE_ENV !== "production"
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, firstName, lastName, amount, plan } = body;

    const collection = intasend.collection();
    const resp = await collection.charge({
      first_name: firstName || "Creator",
      last_name: lastName || "User",
      email: email || "user@creatoros.com",
      host: process.env.NEXTAUTH_URL || "http://localhost:3000",
      amount: amount || 19,
      currency: "USD",
      api_ref: `creatoros-${plan}-${Date.now()}`,
      redirect_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings?upgraded=true`,
    });

    return NextResponse.json({ url: resp.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout" },
      { status: 500 }
    );
  }
}
