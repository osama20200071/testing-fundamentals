import type { paths } from '@octokit/openapi-types';
type OrgRepoResponse =
  paths['/repos/{owner}/{repo}']['get']['responses']['200']['content']['application/json'];

export type Fetch = typeof fetch;

export class GithubApi {
  constructor(
    private token: string | undefined,
    private localFetch: Fetch = fetch,
    private localDelay: (ms: number) => Promise<void> = delay
  ) {}

  async getRepository(user: string, repo: string) {
    const headers: HeadersInit = {
      'User-Agent': 'Qwik Workshop',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (this.token) {
      headers['Authorization'] = 'Bearer ' + this.token;
    }

    return Promise.race([
      this.localDelay(4000).then(() => ({ response: 'timeout' })),
      this.localFetch(`https://api.github.com/repos/${user}/${repo}`, {
        headers,
      }).then((res) => res.json()),
    ]);

    // const response = await this.localFetch(
    //   `https://api.github.com/repos/${user}/${repo}`,
    //   {
    //     headers,
    //   }
    // );
    // const repository = (await response.json()) as OrgRepoResponse;
    // return repository;
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
