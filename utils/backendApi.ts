async function backendApi<T>(path: string, config: RequestInit) {
  const response = await fetch("http://localhost:3000/api" + path, {
    ...config,
    cache: "no-store",
  });

  const body = await response.json();

  return body;
}

export default backendApi;
