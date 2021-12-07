import axios from 'axios';

class Fetch {
    static fetchMovieTitles = async() => {
        return axios
            .get(`http://localhost:8000/titles`)
            .then(({data}) => {
                return JSON.stringify(data);
            })
            .catch(error => {
                console.log(error)
            })
    }
    static fetchMovieRating = async(movieTitle) => {
        return axios
            .get(`http://localhost:8000/rating`, {
                params: movieTitle
            })
            .then(({data}) => {
                return JSON.stringify(data);
            })
            .catch(error => {
                console.log(error)
            })
    }
    static fetchMovieActors = async(movieTitle) => {
        return axios
            .get(`http://localhost:8000/actors`, {
                params: movieTitle
            })
            .then(({data}) => {
                return JSON.stringify(data);
            })
            .catch(error => {
                console.log(error)
            })
    }
    static fetchMovieGenre = async(movieTitle) => {
        return axios
            .get(`http://localhost:8000/genre`, {
                params: movieTitle
            })
            .then(({data}) => {
                return JSON.stringify(data);
            })
            .catch(error => {
                console.log(error)
            })
    }
}

export default Fetch;