import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getRevenueData } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const accessToken = token.accessToken as string;

  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channelId");
  const months = parseInt(searchParams.get("months") || "6");

  if (!channelId) {
    return NextResponse.json({ error: "channelId required" }, { status: 400 });
  }

  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  try {
    const revenue = await getRevenueData(accessToken, channelId, startDate, endDate);
    return NextResponse.json({ revenue });
  } catch (error) {
    console.error("Revenue fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch revenue" }, { status: 500 });
  }
}
