import { describe, it } from 'vitest';
import { GithubApi } from './githubApi';

describe('github-api', () => {
  describe('getRepository', () => {
    it("should return the repository info from GitHub's API", async ({
      expect,
    }) => {
      const api = new GithubApi(undefined);
      const response = await api.getRepository('mhevery', 'qwik');
      expect(response).toMatchSnapshot();
    });
  });
});
