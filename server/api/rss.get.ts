export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const data = await fetch(query.url);
  return await data.text();
})
