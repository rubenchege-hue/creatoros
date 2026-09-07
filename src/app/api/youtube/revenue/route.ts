import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRevenueData } from "@/lib/youtube";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

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
    const revenue = await getRevenueData(session.accessToken, channelId, startDate, endDate);
    return NextResponse.json({ revenue });
  } catch (error) {
    console.error("Revenue fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch revenue" }, { status: 500 });
  }
}
