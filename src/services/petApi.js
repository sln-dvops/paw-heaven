/**
 * Public external API calls for entertainment photos only, not adoptable pets.
 * References: https://docs.thecatapi.com/docs/examples/images and
 * https://dog.ceo/dog-api/documentation/random
 */
export async function getRandomPetPhoto(species) {
  if (!['cat', 'dog'].includes(species)) throw new Error('Unsupported species');
  const endpoint = species === 'cat' ? 'https://api.thecatapi.com/v1/images/search' : 'https://dog.ceo/api/breeds/image/random';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(endpoint, {
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Pet photo API returned ${response.status}`);
    const data = await response.json();
    const image = species === 'cat' ? data?.[0]?.url : data?.message;
    if (typeof image !== 'string' || !image.startsWith('https://')) throw new Error('Invalid API photo response');
    return image;
  } finally {
    clearTimeout(timer);
  }
}
