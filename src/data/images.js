export const petImages = {
  "pet-1": "/images/golden.jpg", // Biscuit
  "pet-2": "/images/cat1.jpg", // Mochi
  "pet-3": "/images/peanut.jpg", // Peanut
  "pet-4": "/images/cat2.jpg", // Pumpkin
  "pet-5": "/images/shadow.jpg", // Shadow
  "pet-6": "/images/cloud.jpg", // Cloud
  "pet-7": "/images/toffee.jpg", // Toffee
  "pet-8": "/images/oreo.jpg", // Oreo
  "pet-9": "/images/sunny.jpg", // Sunny
};
export function resolvePetImage(source) {
  const match =
    typeof source === "string" && source.match(/^\/images\/(pet-\d+)\.webp$/);
  return (match ? petImages[match[1]] : source) || petImages["pet-1"];
}
