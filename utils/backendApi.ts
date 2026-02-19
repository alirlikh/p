async function backendApi<T>(path: string, config: RequestInit) {
  const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + path, {
    ...config,
    cache: "no-store",
  });

  const body = await response.json();

  return body;
}

export default backendApi;
