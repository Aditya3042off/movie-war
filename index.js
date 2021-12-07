const autoCompleteConfig = {
    renderOption(movie) {
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src ="${imgSRC}" >
            ${movie.Title} (${movie.Year})
            `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async getMovieData(mveTitle) {
        const streamData = await fetch(`http://www.omdbapi.com/?apikey=5e99573&s=${mveTitle}`);
        const data = await streamData.json();
    
        if(data.Error) return [];
    
        return data.Search;
    }
}

createAutoComplete({
    ...autoCompleteConfig, 
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'),'left');
    }
});
createAutoComplete({
    ...autoCompleteConfig,
     root: document.querySelector('#right-autocomplete'),
     onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'),'right');
    }
});

// CODE FOR RENDERING MOVIE DATA AFTER CLICK

let leftMovie;
let rightMovie;

async function onMovieSelect(movie,summaryElement,side) {
    const streamData = await fetch(`http://www.omdbapi.com/?apikey=5e99573&i=${movie.imdbID}`);
    const movieData = await streamData.json();
    console.log(movieData);

    summaryElement.innerHTML =  movieTemplate(movieData);

    if(side==='left') {
        leftMovie = movieData;
    } else{
        rightMovie = movieData;
    }

    if(leftMovie && rightMovie) {
        runComparision();
    }
}

const runComparision = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat,index) => {
        const rightStat = rightSideStats[index];
        
        if(leftStat.dataset.value < rightStat.dataset.value) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })

}

function movieTemplate(movieDetails) {
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
    const metascore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes  =parseInt(movieDetails.imdbVotes.replace(/,/g,''));
    
    const awards = movieDetails.Awards.split('').reduce((prev,word) => {
        const value = parseInt(word);

        if(isNaN(value)) {
            return prev;
        }else {
            return prev + value;
        }
    }, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">BoxOffice</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `

}