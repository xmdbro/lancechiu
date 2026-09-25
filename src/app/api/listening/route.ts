const NOW_PLAYING_URL = "https://listening.lancechiu.com/api/now-playing";

export async function GET() {
  try {
    const response = await fetch(NOW_PLAYING_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(6_000),
    });

    if (!response.ok) throw new Error("Listening is unavailable");

    const data: unknown = await response.json();
    if (!data || typeof data !== "object") {
      throw new Error("Invalid listening response");
    }

    const { isPlaying, track } = data as {
      isPlaying?: unknown;
      track?: { name?: unknown; artist?: unknown } | null;
    };

    if (
      !track ||
      typeof track.name !== "string" ||
      typeof track.artist !== "string" ||
      !track.name.trim() ||
      !track.artist.trim()
    ) {
      return Response.json({ track: null }, { headers: { "Cache-Control": "no-store" } });
    }

    return Response.json(
      {
        isPlaying: isPlaying === true,
        track: { name: track.name, artist: track.artist },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Listening is unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
