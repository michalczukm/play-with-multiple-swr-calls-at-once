import useSWR, { Fetcher, SWRResponse } from 'swr';

async function generatorToArray<T>(gen: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const x of gen) {
    out.push(x);
  }
  return out;
}

async function* fetcherGenerator(...urls: string[]) {
  for (const url of urls) {
    console.log('🚀 ~ file: App.tsx ~ line 13 ~ function*fetcherGenerator ~ url', url);
    yield fetch(url).then((response) => response.json());
  }
}

const fetcherWithGeneratorToArray = <T,>(...urls: string[]): Promise<T[]> => {
  console.log('🚀 ~ file: App.tsx ~ line 19 ~ function*foo ~ urls', urls);
  return generatorToArray(fetcherGenerator(...urls));
};

const fetcherWithPromiseAllSettled: Fetcher = async <T,>(...urls: string[]) => {
  const f = (url: string) => fetch(url).then((r) => r.json());
  const results = await Promise.allSettled<T>(
    urls.map((url) => {
      console.log('🚀 ~ file: App.tsx ~ line 8 ~ returnPromise.all<T> ~ url', url);

      return f(url);
    }),
  );

  const [successfulResponses, failedResponses] = results.reduce(
    (acc, current) => {
      console.log('🚀 ~ file: App.tsx ~ line 36 ~ current.status', current.status)
      if (current.status === 'fulfilled') {
        acc[0].push(current);
      } else {
        acc[1].push(current);
      }

      return acc;
    },
    [[] as PromiseFulfilledResult<Awaited<T>>[], [] as PromiseRejectedResult[]],
  );

  return [successfulResponses, failedResponses];
};

const fetcher: Fetcher = <T,>(...urls: string[]): Promise<T[]> => {
  const f = (url: string) => fetch(url).then((r) => r.json());
  return Promise.all<T>(
    urls.map((url) => {
      console.log('🚀 ~ file: App.tsx ~ line 8 ~ returnPromise.all<T> ~ url', url);

      return f(url);
    }),
  );
};

function App() {
  // based on https://github.com/vercel/swr/discussions/786#discussioncomment-1436230

  const { data, error } = useSWR(
    ['/api/users/1?responseCode=500', '/api/users/2?delaySeconds=3'],
    fetcherWithPromiseAllSettled,
    {
      revalidateOnFocus: true,
    },
  );

  const state = {
    data: data,
    isError: !!error,
    isLoading: !data && !error,
  };
  console.log('🚀 ~ file: App.tsx ~ line 43 ~ App ~ error', error);

  return (
    <>
      <code>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </code>
    </>
  );
}

export default App;
