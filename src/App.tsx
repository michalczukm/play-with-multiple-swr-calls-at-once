import useSWR, { Fetcher, SWRResponse } from 'swr';

const fetcher: Fetcher = <T,>(...urls: string[]): Promise<T[]> => {
  const f = (url: string) => fetch(url).then((r) => r.json());
  return Promise.all<T>(
    urls.map((url) => {
      console.log('🚀 ~ file: App.tsx ~ line 8 ~ returnPromise.all<T> ~ url', url);

      return f(url);
    }),
  );
};

export function swrToStatus<Data, Error>({
  data,
  error,
}: Pick<SWRResponse<Data, Error>, 'data' | 'error'>): 'loading' | 'failure' | 'success' {
  if (!error && !data) {
    return 'loading';
  } else if (error) {
    return 'failure';
  } else {
    return 'success';
  }
}

function App() {
  // based on https://github.com/vercel/swr/discussions/786#discussioncomment-1436230

  const { data, error } = useSWR(['/api/users/1', '/api/users/2?delaySeconds=10'], fetcher, {
    revalidateOnFocus: true,
  });

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
