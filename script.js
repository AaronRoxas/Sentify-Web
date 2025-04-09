const themeSwitch = document.getElementById("theme-switch");
const meterPointer = document.getElementById("meter-pointer");
const sentimentResult = document.getElementById("sentiment-result");
const sentimentDescription = document.getElementById
("sentiment-description");
const resultSection = document.getElementById("result-section");


// Light and Dark Mode toggle
themeSwitch.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  });

function predictSentiment() {
    const review = document.getElementById('review-input').value;

    fetch('http://127.0.0.1:5220/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ review: review })
    })
        .then(response => response.json())
        .then(data => {
            const sentiment = data.sentiment;
            let meterPosition;
            if (sentiment === "positive") {
                meterPosition = "95%";
            } else if (sentiment === "neutral") {
                meterPosition = "50%";
            } else {
                meterPosition = "10%";
            }
            meterPointer.style.left = meterPosition;

            if (sentiment === "positive") {
                sentimentResult.textContent = "Positive Sentiment";
                sentimentDescription.textContent = "This review expresses satisfaction with the app.";
            } else if (sentiment === "neutral") {
                sentimentResult.textContent = "Neutral Sentiment";
                sentimentDescription.textContent = "This review is balanced or neutral.";
            } else {
                sentimentResult.textContent = "Negative Sentiment";
                sentimentDescription.textContent = "This review expresses dissatisfaction with the app.";
            }

        })
        .catch(error => {
            console.error('Error: ', error);
        });
}

function saveReview(review, sentiment) {
    let reviews = JSON.parse(localStorage.getItem("appReviewSentiments")) || [];
    reviews.unshift({ text: review, sentiment: sentiment, date: new Date().toISOString() });

    if (reviews.length > 5) {
      reviews = reviews.slice(0, 5);
    }

    localStorage.setItem("appReviewSentiments", JSON.stringify(reviews));
    loadReviews();
  }

function loadReviews() {
    reviewsList.innerHTML = "";
    const reviews = JSON.parse(localStorage.getItem("appReviewSentiments")) || [];

    if (reviews.length === 0) {
      reviewsList.innerHTML = '<li class="review-item">No reviews analyzed yet. Be the first to analyze!</li>';
      return;
    }

    reviews.forEach((review, index) => {
      const reviewItem = document.createElement("li");
      reviewItem.className = "review-item fade-in";
      reviewItem.style.animationDelay = `${index * 0.1}s`;

      let displayText = review.text;
      if (displayText.length > 50) {
        displayText = displayText.substring(0, 50) + "...";
      }

      reviewItem.innerHTML = `
        <div class="review-text">${displayText}</div>
        <div class="review-sentiment ${review.sentiment}">${review.sentiment}</div>
      `;

      reviewsList.appendChild(reviewItem);
    });
  }

