export async function readApiResponse(response, fallbackMessage) {
  const body = await response.text();
  let data;

  try {
    data = JSON.parse(body);
  } catch {
    const message = response.ok
      ? 'The server returned an invalid response. Please try again.'
      : `The server returned a non-JSON response (HTTP ${response.status}). Check the backend deployment logs and environment variables.`;
    throw new Error(message);
  }

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}
