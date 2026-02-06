export function optimizeImage(url: string, width = 400) {
  if (!url) return "";

  return url.replace(
    "/upload/",
    `/upload/w_${width},q_auto,f_auto/`
  );
}
