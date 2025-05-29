export default defineEventHandler(async (event): Promise<string> => {
  const query = getQuery(event);
  return await $fetch<string>(query.url, {
    headers: {'Cache-Control': 'no-cache'}
  });
});