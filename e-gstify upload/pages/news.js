const apiKey = '05300795b94840fab001d0f6c34db0a6'; // Replace with your NewsAPI.org API key
const newsContainer = document.getElementById('newsContainer');

async function fetchNews() {
    const response = await fetch(`https://newsapi.org/v2/everything?q=GST%20%26%20Indian%20Tax&apiKey=${apiKey}`);
    const data = await response.json();
    displayNews(data.articles);
}

function displayNews(articles) {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
        const newsCard = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" class="card-img-top" alt="News Image">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.publishedAt.split('T')[0]}</p>
                        <p class="card-text">${article.source.name}</p>
                        <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
                    </div>
                </div>
            </div>
        `;
        newsContainer.innerHTML += newsCard;
    });
}

fetchNews();
