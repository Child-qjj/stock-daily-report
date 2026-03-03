import { Octokit } from '@octokit/rest';
import { CONFIG } from './config';

export async function createGitHubIssue(title: string, body: string, label: string) {
  if (!CONFIG.GITHUB_TOKEN || !CONFIG.REPO_OWNER || !CONFIG.REPO_NAME) {
    console.log('GitHub config missing, skipping issue creation.');
    return;
  }

  const octokit = new Octokit({ auth: CONFIG.GITHUB_TOKEN });

  try {
    const { data } = await octokit.issues.create({
      owner: CONFIG.REPO_OWNER,
      repo: CONFIG.REPO_NAME,
      title,
      body,
      labels: [label],
    });
    console.log(`GitHub Issue created: ${data.html_url}`);
    return data.html_url;
  } catch (error) {
    console.error('Error creating GitHub issue:', error);
  }
}
