import { google } from "googleapis";

export function getYouTubeClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  return {
    youtube: google.youtube({ version: "v3", auth: oauth2Client }),
    youtubeAnalytics: google.youtubeAnalytics({ version: "v2", auth: oauth2Client }),
  };
}

export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

export async function getChannelInfo(accessToken: string): Promise<ChannelInfo[]> {
  const { youtube } = getYouTubeClient(accessToken);

  const response = await youtube.channels.list({
    part: ["snippet", "statistics", "contentDetails"],
    mine: true,
  });

  return (response.data.items || []).map((item) => ({
    id: item.id || "",
    title: item.snippet?.title || "",
    description: item.snippet?.description || "",
    thumbnailUrl: item.snippet?.thumbnails?.default?.url || "",
    subscriberCount: item.statistics?.subscriberCount || "0",
    viewCount: item.statistics?.viewCount || "0",
    videoCount: item.statistics?.videoCount || "0",
  }));
}

export interface RevenueData {
  estimatedRevenue: number;
  estimatedAdSense: number;
  estimatedPremiumRevenue: number;
  playbacks: number;
  earningsPerPlayback: number;
  period: string;
}

export async function getRevenueData(
  accessToken: string,
  channelId: string,
  startDate: string,
  endDate: string
): Promise<RevenueData[]> {
  const { youtubeAnalytics } = getYouTubeClient(accessToken);

  const response = await youtubeAnalytics.reports.query({
    ids: `channel==${channelId}`,
    startDate,
    endDate,
    metrics: [
      "estimatedRevenue",
      "estimatedAdRevenue",
      "estimatedRedPartnerRevenue",
      "playbacks",
      "earningsPerPlayback",
    ].join(","),
    dimensions: "month",
    sort: "month",
  });

  // When using dimensions, row[0] is the dimension value (month string)
  // Metrics start at index 1
  return (response.data.rows || []).map((row) => ({
    period: row[0] as string,
    estimatedRevenue: row[1] as number || 0,
    estimatedAdSense: row[2] as number || 0,
    estimatedPremiumRevenue: row[3] as number || 0,
    playbacks: row[4] as number || 0,
    earningsPerPlayback: row[5] as number || 0,
  }));
}

export interface VideoStats {
  videoId: string;
  title: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  publishedAt: string;
  thumbnailUrl: string;
}

export async function getRecentVideos(
  accessToken: string,
  channelId: string,
  maxResults: number = 10
): Promise<VideoStats[]> {
  const { youtube } = getYouTubeClient(accessToken);

  const channelResponse = await youtube.channels.list({
    part: ["contentDetails"],
    id: [channelId],
  });

  const uploadsPlaylistId =
    channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) return [];

  const playlistResponse = await youtube.playlistItems.list({
    part: ["snippet", "contentDetails"],
    playlistId: uploadsPlaylistId,
    maxResults,
  });

  const videoIds = playlistResponse.data.items
    ?.map((item) => item.contentDetails?.videoId)
    .filter(Boolean) as string[];

  if (!videoIds?.length) return [];

  const videosResponse = await youtube.videos.list({
    part: ["statistics", "snippet"],
    id: videoIds,
  });

  return (videosResponse.data.items || []).map((item) => ({
    videoId: item.id || "",
    title: item.snippet?.title || "",
    viewCount: item.statistics?.viewCount || "0",
    likeCount: item.statistics?.likeCount || "0",
    commentCount: item.statistics?.commentCount || "0",
    publishedAt: item.snippet?.publishedAt || "",
    thumbnailUrl: item.snippet?.thumbnails?.medium?.url || "",
  }));
}

export interface AnalyticsData {
  views: number;
  watchTime: number;
  subscribersGained: number;
  estimatedRevenue: number;
  impressions: number;
  ctr: number;
  averageViewDuration: number;
}

export async function getChannelAnalytics(
  accessToken: string,
  channelId: string,
  startDate: string,
  endDate: string
): Promise<AnalyticsData> {
  const { youtubeAnalytics } = getYouTubeClient(accessToken);

  const response = await youtubeAnalytics.reports.query({
    ids: `channel==${channelId}`,
    startDate,
    endDate,
    metrics: [
      "views",
      "estimatedMinutesWatched",
      "subscribersGained",
      "estimatedRevenue",
      "impressions",
      "impressionsClickThroughRate",
      "averageViewDuration",
    ].join(","),
  });

  const row = response.data.rows?.[0];
  return {
    views: row?.[0] as number || 0,
    watchTime: row?.[1] as number || 0,
    subscribersGained: row?.[2] as number || 0,
    estimatedRevenue: row?.[3] as number || 0,
    impressions: row?.[4] as number || 0,
    ctr: row?.[5] as number || 0,
    averageViewDuration: row?.[6] as number || 0,
  };
}
