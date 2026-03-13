export async function fetchPage(
  url: string
): Promise<{ html: string; finalUrl: string; statusCode: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; HospitalReadinessAnalyzer/1.0; +https://hospitalwebsites.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) {
      throw new FetchError(
        `HTTP ${res.status}: ${res.statusText}`,
        res.status
      );
    }

    const html = await res.text();
    return { html, finalUrl: res.url, statusCode: res.status };
  } catch (err: unknown) {
    if (err instanceof FetchError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new FetchError(
        "The site took too long to respond (>10s). This may indicate heavy JavaScript rendering.",
        0
      );
    }
    const message =
      err instanceof Error ? err.message : "Failed to fetch the URL";
    if (message.includes("ENOTFOUND") || message.includes("getaddrinfo")) {
      throw new FetchError(
        "Could not resolve the domain. Please check the URL.",
        0
      );
    }
    throw new FetchError(message, 0);
  } finally {
    clearTimeout(timeout);
  }
}

export async function probeEndpoint(
  url: string
): Promise<{ exists: boolean; contentType?: string; body?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; HospitalReadinessAnalyzer/1.0; +https://hospitalwebsites.com)",
      },
    });

    if (!res.ok) return { exists: false };

    const contentType = res.headers.get("content-type") || undefined;
    const body = await res.text();
    return { exists: true, contentType, body };
  } catch {
    return { exists: false };
  } finally {
    clearTimeout(timeout);
  }
}

export class FetchError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "FetchError";
  }
}
