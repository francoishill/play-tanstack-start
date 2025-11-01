import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";
import { loadConfig } from "~/lib/config";
import { DEFAULT_CONCURRENCY } from "~/lib/constants";
import { scanRepositoriesStreaming } from "~/lib/scanner";
import type { GitRepoStatus, RepoTiming } from "~/lib/types";

const inputSchema = z.object({
  scanPath: z.string().min(1),
  depth: z.number().min(0).max(20).default(4),
});

export type ScanStreamMessage =
  | {
      type: "repo";
      repo: GitRepoStatus;
      timing: RepoTiming;
    }
  | {
      type: "progress";
      message: string;
      totalRepos?: number;
    }
  | {
      type: "complete";
      totalRepos: number;
    }
  | {
      type: "start";
      startTime: string;
    };

/**
 * Server function to scan git repositories with streaming progress
 */
export const scanGitReposServerFn = createServerFn({ method: "GET" })
  .inputValidator(inputSchema)
  .handler(async function* ({ data }) {
    // Default scan parameters - in a real app, you'd pass these as params
    const { scanPath, depth } = data;
    const concurrency = DEFAULT_CONCURRENCY;

    // Load config
    const config = await loadConfig(scanPath, {
      ignore: [],
      defaultIgnore: true,
    });

    // Start scanning with progress tracking
    const startTime = new Date();

    // Helper to add delay for stream flushing to prevent frame concatenation
    const delay = () => new Promise((resolve) => setTimeout(resolve, 5));

    // Yield start message as object (TanStack handles JSON serialization)
    yield {
      type: "start" as const,
      startTime: startTime.toISOString(),
    };
    await delay(); // Force flush opportunity

    // Scan repositories with streaming
    for await (const update of scanRepositoriesStreaming(
      scanPath,
      depth,
      config.ignorePatterns,
      concurrency
    )) {
      let message: ScanStreamMessage;

      if (update.type === "repo" && update.repo && update.timing) {
        message = {
          type: "repo" as const,
          repo: update.repo,
          timing: update.timing,
        };
      } else if (update.type === "progress" && update.progress) {
        const msg = update.progress.relativePath
          ? `Scanning ${update.progress.relativePath}`
          : update.progress.message;
        message = {
          type: "progress" as const,
          message: msg,
          totalRepos: update.totalRepos,
        };
      } else if (update.type === "complete") {
        message = {
          type: "complete" as const,
          totalRepos: update.totalRepos || 0,
        };
      } else {
        continue; // Skip unknown message types
      }

      // Yield as object and add delay to prevent frame concatenation
      yield message;
      await delay();
    }
  });
