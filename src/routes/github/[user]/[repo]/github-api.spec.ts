import { describe, it, vi, Mock, beforeEach } from 'vitest';
import { delay, Fetch, GithubApi } from './githubApi';
import { object } from 'valibot';

describe('github-api', () => {
  let fetchMock: Mock<Parameters<Fetch>, ReturnType<Fetch>>;
  let delayMock: Mock<[number], Promise<void>>;
  let api: GithubApi;

  beforeEach(() => {
    fetchMock = vi.fn<Parameters<Fetch>, ReturnType<Fetch>>(mockPromise);
    delayMock = vi.fn<[number], Promise<void>>(mockPromise);
    api = new GithubApi('TOKEN', fetchMock, delayMock);
  });

  describe('getRepository', () => {
    it("should return the repository info from GitHub's API", async ({
      expect,
    }) => {
      const responsePromise = api.getRepository('USERNAME', 'REPO');

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.github.com/repos/USERNAME/REPO`,
        {
          headers: {
            'User-Agent': 'Qwik Workshop',
            'X-GitHub-Api-Version': '2022-11-28',
            Authorization: 'Bearer TOKEN',
          },
        }
      );

      const firstCallResult = fetchMock.mock.results[0];
      const returnedPromise = firstCallResult.value;
      returnedPromise.resolve(new Response('"RESPONSE"'));

      expect(await responsePromise).toEqual('RESPONSE');
    });

    it('should timeout after x seconds with timeout response', async ({
      expect,
    }) => {
      const responsePromise = api.getRepository('USERNAME', 'REPO');

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.github.com/repos/USERNAME/REPO`,
        {
          headers: {
            'User-Agent': 'Qwik Workshop',
            'X-GitHub-Api-Version': '2022-11-28',
            Authorization: 'Bearer TOKEN',
          },
        }
      );

      expect(delayMock).toHaveBeenCalledWith(4000);

      // resolves immediately so we don't need to wait the full actual delay
      delayMock.mock.results[0].value.resolve();

      expect(await responsePromise).toEqual({ response: 'timeout' });
    });
  });

  describe('getRepositories', () => {
    it('should fetch all the repos for specific username', async ({
      expect,
    }) => {
      const responsePromise = api.getRepositories('USERNAME');

      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.github.com/users/USERNAME/repos?per_page=30&page=1',
        expect.any(Object)
      );

      const repoSet1 = new Array(30).fill(null).map((_, i) => ({ id: i }));

      // we are resolving this particular promise , but we don't yield to the schedular
      fetchMock.mock.results[0].value.resolve(
        new Response(JSON.stringify(repoSet1))
      );

      // why this ?
      // it's a little trick to yield to the schedule so the other promise can run
      await delay(0); // to make sure the async operations happen in the correct order

      const repoSet2 = [{ id: 30 }];
      fetchMock.mock.results[1].value.resolve(
        new Response(JSON.stringify(repoSet2))
      );

      expect(await responsePromise).toEqual([...repoSet1, ...repoSet2]);
    });
  });
});

// First, define our ControllablePromise type
type ControllablePromise<T> = Promise<T> & {
  resolve: (value: T) => void;
  reject: (error: any) => void;
};

// The mockPromise function stays the same as in your code
function mockPromise<T>() {
  let resolve: (value: T) => void;
  let reject: (error: string) => void;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  }) as ControllablePromise<T>;

  promise.resolve = resolve!;
  promise.reject = reject!;
  return promise;
}
