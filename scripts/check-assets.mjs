import { execFileSync } from "node:child_process";
import { stat } from "node:fs/promises";

const maximumBytes = 5 * 1024 * 1024;
const managedMediaExtensions = new Set([
  ".avi",
  ".m4a",
  ".mkv",
  ".mov",
  ".mp3",
  ".mp4",
  ".psd",
  ".wav",
  ".webm",
]);

const trackedFiles = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
const problems = [];

for (const file of trackedFiles) {
  const extension = file.slice(file.lastIndexOf(".")).toLowerCase();
  const size = (await stat(file)).size;
  if (managedMediaExtensions.has(extension))
    problems.push(`${file}: managed media belongs outside Git`);
  if (size > maximumBytes)
    problems.push(`${file}: ${(size / 1024 / 1024).toFixed(1)} MiB exceeds 5 MiB`);
}

if (problems.length > 0) {
  throw new Error(`Asset policy violations:\n${problems.join("\n")}`);
}

console.log(`Checked ${trackedFiles.length} tracked files against the asset policy.`);
