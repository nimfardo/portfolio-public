/**
 * Shows a shimmer skeleton in a media box while its image loads, and clears
 * it the moment the image paints or fails. The visual half lives in
 * `app/styles/global.css` as `img[data-media-skeleton].is-media-loading`;
 * this only decides WHEN that class is on.
 *
 * The class is applied by JS rather than shipped in the markup on purpose: a
 * cached image is `complete` before this ever runs, so it never gets the
 * class at all and there is no grey flash on a warm load. Only an image that
 * is genuinely still in flight is skeletoned.
 *
 * Call once per page load; safe to call repeatedly (bound images are
 * skipped).
 */
export function initMediaSkeleton(): void {
  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll<HTMLImageElement>(
    'img[data-media-skeleton]:not([data-skeleton-bound])',
  );
  if (images.length === 0) return;

  function arm(img: HTMLImageElement) {
    // Already decoded (cached, or finished while we were getting here) —
    // skeletoning it now would be a pure flash of grey over a picture that
    // is ready to paint.
    if (img.complete) return;

    img.classList.add('is-media-loading');
    const clear = () => img.classList.remove('is-media-loading');
    // Listeners BEFORE the second `complete` check, and that ordering is the
    // whole point. The image can finish between the check above and the
    // attach, and if nothing re-read `complete` afterwards the load event
    // would already have fired and the skeleton would sit there forever.
    img.addEventListener('load', clear, { once: true });
    // `error` matters as much as `load`: a 404 renders alt text, and a
    // shimmering rectangle behind it reads as a page still working rather
    // than a broken asset.
    img.addEventListener('error', clear, { once: true });
    if (img.complete) clear();
  }

  // Arm on APPROACH, not on page load. Most of these carry `loading="lazy"`,
  // so an image far below the fold has not started fetching at all — marking
  // it "loading" would be a lie, and it would leave a shimmer animating on a
  // dozen off-screen elements for as long as the page stayed open. The
  // 300px margin is deliberately close to the browser's own lazy-load
  // threshold, so the skeleton appears at roughly the moment the fetch does.
  if (!('IntersectionObserver' in window)) {
    images.forEach((img) => {
      img.dataset.skeletonBound = '1';
      arm(img);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        arm(entry.target as HTMLImageElement);
      }
    },
    { rootMargin: '300px 0px' },
  );

  images.forEach((img) => {
    img.dataset.skeletonBound = '1';
    observer.observe(img);
  });
}
