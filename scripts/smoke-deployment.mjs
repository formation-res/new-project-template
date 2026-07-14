const [deploymentUrl, expectedCommit] = process.argv.slice(2);
if (!deploymentUrl) throw new Error("Usage: smoke-deployment.mjs <deployment-url> [commit]");

const origin = new URL(deploymentUrl);
if (origin.protocol !== "https:") throw new Error("Deployment URL must use HTTPS");

let lastError;
for (let attempt = 1; attempt <= 6; attempt += 1) {
  try {
    const [pageResponse, versionResponse] = await Promise.all([
      fetch(origin),
      fetch(new URL("/version.json", origin)),
    ]);
    if (!pageResponse.ok) throw new Error(`Homepage returned ${pageResponse.status}`);
    if (!versionResponse.ok) throw new Error(`version.json returned ${versionResponse.status}`);
    const version = await versionResponse.json();
    if (expectedCommit && !expectedCommit.startsWith(version.commit)) {
      throw new Error(`Expected commit ${expectedCommit}, received ${version.commit}`);
    }
    console.log(`Verified ${origin} at commit ${version.commit}.`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    if (attempt < 6) await new Promise((resolve) => setTimeout(resolve, attempt * 2_000));
  }
}

throw lastError;
