(function () {
  const root = document.currentScript?.previousElementSibling;
  if (!root || !root.classList.contains("review-embed")) return;

  const productId = root.dataset.productId;
  const listEl = root.querySelector(".review-embed__list");
  const form = root.querySelector(".review-embed__form");
  const status = root.querySelector(".review-embed__status");

  const proxyBase = "/apps/reviews-proxy";

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function loadReviews() {
    try {
      const res = await fetch(`${proxyBase}/reviews?productId=${encodeURIComponent(productId)}`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to load");
      renderReviews(data.reviews || []);
    } catch (e) {
      listEl.innerHTML = "<p>Unable to load reviews.</p>";
    }
  }

  function renderReviews(reviews) {
    if (!reviews.length) {
      listEl.innerHTML = "<p>No reviews yet.</p>";
      return;
    }
    listEl.innerHTML = reviews
      .map(
        (r) => `
        <div class="review-embed__item" style="margin: 8px 0;">
          <div><strong>${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</strong></div>
          <div>${escapeHtml(r.message)}</div>
          <small>${new Date(r.createdAt).toLocaleDateString()}</small>
        </div>
      `
      )
      .join("");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "Submitting...";

    const fd = new FormData(form);
    const payload = {
      productId,
      rating: Number(fd.get("rating")),
      message: String(fd.get("message") || ""),
    };

    try {
      const res = await fetch(`${proxyBase}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Submit failed");

      form.reset();
      status.textContent = "Thanks! Your review was submitted.";
      await loadReviews();
    } catch (err) {
      status.textContent = "Sorry—could not submit your review.";
    }
  });

  loadReviews();
})();
