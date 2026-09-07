import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getChannelInfo, getRevenueData, getRecentVideos, getChannelAnalytics } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  try {
    // Get the JWT token from the request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.accessToken) {
      return NextResponse.json({ error: "Not authenticated", needsReconnect: true }, { status: 401 });
    }

    const accessToken = token.accessToken as string;

    const channels = await getChannelInfo(accessToken);
    if (!channels.length) {
      return NextResponse.json({ error: "No channel found" }, { status: 404 });
    }

    const channel = channels[0];
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    let revenue: Awaited<ReturnType<typeof getRevenueData>> = [];
    let videos: Awaited<ReturnType<typeof getRecentVideos>> = [];
    let analytics: Awaited<ReturnType<typeof getChannelAnalytics>> = {
      views: 0, watchTime: 0, subscribersGained: 0,
      estimatedRevenue: 0, impressions: 0, ctr: 0,
      averageViewDuration: 0,
    };

    try {
      videos = await getRecentVideos(accessToken, channel.id, 10);
    } catch (e) {
      console.error("Videos fetch failed");
    }

    try {
      analytics = await getChannelAnalytics(accessToken, channel.id, startDate, endDate);
    } catch (e) {
      console.error("Analytics fetch failed");
    }

    try {
      revenue = await getRevenueData(accessToken, channel.id, startDate, endDate);
    } catch (e) {
      console.error("Revenue fetch failed (channel may not be monetized)");
    }

    return NextResponse.json({ channel, revenue, videos, analytics });
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json({ error: "Failed to fetch YouTube data" }, { status: 500 });
  }
}
