import { describe, it, vi, Mock, beforeEach } from 'vitest';
import { Fetch, GithubApi } from './githubApi';

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
