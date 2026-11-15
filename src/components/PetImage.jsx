import { petImages, resolvePetImage } from "../data/images";

export default function PetImage({ src, alt = "", onError, ...props }) {
  const source = resolvePetImage(src);
  const illustrated = /^\/images\/pet-[1-9]\.webp$/.test(source);
  return (
    <img
      {...props}
      src={source}
      alt={illustrated ? `${alt} (replaceable generated illustration)` : alt}
      title={
        illustrated
          ? "Generated illustration · verified photograph pending"
          : undefined
      }
      onError={(event) => {
        const fallback = petImages["pet-1"];
        if (event.currentTarget.getAttribute("src") !== fallback) {
          event.currentTarget.src = fallback;
          event.currentTarget.alt =
            "Image unavailable · replaceable generated illustration";
        }
        onError?.(event);
      }}
    />
  );
}
