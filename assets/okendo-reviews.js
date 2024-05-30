// Widget lifecycle hook. Gets fired when Okendo Widgets are finished initializing
window.okeReviewsWidgetOnInit = function () {
    const reviewMain = document.querySelector(".js-okeReviews-reviews-main");
    if (reviewMain) {
        const callback = function (mutationList) {
            for (const mutation of mutationList) {
                mutation.addedNodes.forEach((n) => formatDateForElement(n));
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(reviewMain, { childList: true });

        const reviews = document.querySelectorAll(".okeReviews-reviews-review");
        reviews.forEach((n) => formatDateForElement(n));
    }
};

window.okeReviewsQandaOnInit = function () {
    const questionMain = document.querySelector(".js-okeReviews-questions-main");
    if (questionMain) {
        const callback = function (mutationList) {
            for (const mutation of mutationList) {
                mutation.addedNodes.forEach((n) => formatDateForElement(n));
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(questionMain, { childList: true });

        const questions = document.querySelectorAll(".okeReviews-question");
        questions.forEach((n) => formatDateForElement(n));
    }
};

function formatDateForElement(nodeElement) {
    if (nodeElement) {
        const reviewDates = nodeElement.querySelectorAll("[data-oke-reviews-date]");
        for (const reviewDate of reviewDates) {
            const dateIsoString = reviewDate.getAttribute("data-oke-reviews-date");
            const date = new Date(dateIsoString);
            const localeDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            reviewDate.innerText = localeDate;
        }
    }
}