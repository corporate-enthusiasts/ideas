import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const OWNER = process.env.GITHUB_OWNER || "corporate-enthusiasts";
const REPO = process.env.GITHUB_REPO || "botboys-ideas";

interface GitHubContentFile {
  type: string;
  name: string;
  path: string;
  sha: string;
  content?: string;
  encoding?: string;
}

export async function listIdeaSlugs(): Promise<string[]> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: "ideas",
    });

    if (!Array.isArray(data)) return [];
    return data
      .filter((item: { type: string }) => item.type === "dir")
      .map((item: { name: string }) => item.name);
  } catch {
    return [];
  }
}

export async function getFileContent<T>(path: string): Promise<{ data: T; sha: string } | null> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path,
    });

    const file = data as GitHubContentFile;
    if (file.type !== "file" || !file.content) return null;

    const content = Buffer.from(file.content, "base64").toString("utf-8");
    return { data: JSON.parse(content) as T, sha: file.sha };
  } catch {
    return null;
  }
}

export async function putFileContent(
  path: string,
  content: string,
  message: string,
  sha?: string,
): Promise<void> {
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path,
    message,
    content: Buffer.from(content).toString("base64"),
    ...(sha ? { sha } : {}),
  });
}
