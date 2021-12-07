import './App.css';
import {useState, useEffect, useRef, useCallback} from "react";
import Fetch from './Fetch.js';

function App() {
    const [movieTitles, setMovieTitles] = useState([]);
    const [searching, setSearching] = useState('');
    const [searchResultValue, setSearchResultValue] = useState([]);
    const [movieBeingSearched, setMovieBeingSearched] = useState('');
    const [movieRating, setMovieRating] = useState('');
    const [movieActors, setMovieActors] = useState([]);
    const [movieGenre, setMovieGenres] = useState('');
    const [dataClear, setDataClear] = useState(true);
    const [,update] = useState({});
    const forceUpdate = useCallback(() => update({}), []);

    let fetched = useRef(false);
    let searchBool = useRef(false);
    let movieDataFetched = useRef(false);
    let actorsFetched = useRef(false);
    let ratingFetched = useRef(false);
    let genresFetched = useRef(false);

    async function getMovieTitles() {
        try{
            let set_data = []
            const data = await Fetch.fetchMovieTitles();
            let parse_data = JSON.parse(data);
            for (let i = 0; i < parse_data.length; i++) {
                parse_data[i].id = i + 1;
                set_data.push(parse_data[i]);
            }
            fetched.current = true;
            setMovieTitles(set_data);
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getMovieTitles();
    }, [])

    async function getMovieRating() {
        try{
            const data = await Fetch.fetchMovieRating(movieBeingSearched);
            if (data === '"Bad Request"') {
                setMovieRating('N/A')
            } else {
                setMovieRating(data)
            }
            ratingFetched.current = true;
            forceUpdate();

        } catch (e) {
            console.error(e)
        }
    }
    async function getMovieActors() {
        try{
            let set_data = [];
            const data = await Fetch.fetchMovieActors(movieBeingSearched);
            if (data) {
                let parse_data = JSON.parse(data);
                for (let i = 0; i < parse_data.length; i++) {
                    parse_data[i].id = i + 1;
                    set_data.push(parse_data[i]);
                }
            }
            if (!set_data) {
                set_data.push('N/A')
                setMovieActors(set_data);
            } else {
                setMovieActors(set_data);
            }
            actorsFetched.current = true;
            forceUpdate();

        } catch (e) {
            console.error(e)
        }
    }
    async function getMovieGenres() {
        try{
            const data = await Fetch.fetchMovieGenre(movieBeingSearched);
            if (data === '"Bad Request"') {
                setMovieGenres('N/A');
            } else {
                setMovieGenres(data);
            }
            genresFetched.current = true;
            forceUpdate();

        } catch (e) {
            console.error(e)
        }
    }

    const searchResults = () => {
        searchBool.current = true;
        let data = []
        for (let i = 0; i < movieTitles.length; i++) {
            let value = movieTitles[i].title.search(searching);
            if (value >= 0) {
                data.push(movieTitles[i])
            }
        }
        setSearchResultValue(data)
    }
    const findResults = () => {
        movieDataFetched.current = true;
        forceUpdate();
        getMovieRating();
        getMovieActors();
        getMovieGenres();
        forceUpdate();
    }

    useEffect(() => {
        actorsFetched.current = true;
    }, [movieActors])

    useEffect(() => {
        ratingFetched.current = true;
    }, [movieRating])

    useEffect(() => {
        genresFetched.current = true;
    }, [movieGenre])

    useEffect(() => {
        actorsFetched.current = false;
        ratingFetched.current = false;
        genresFetched.current = false;
    }, [dataClear])

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    IMDb Data
                </div>
            </header>
            <div>
                {movieTitles.length !== 0 && fetched ? (
                    <div>
                        <br/>
                        SEARCH:
                        <input type='textarea' placeholder='IMDb Title' onChange={e => setSearching(e.target.value)}/>
                        <button style={{background: "LightBlue", fontWeight: "bold"}} onClick={searchResults}>Submit</button>
                        <button style={{background: "LightCoral", fontWeight: "bold"}} onClick={() => window.location.reload()}>Clear</button>
                    </div>
                ) : (
                    <div>
                        <br/>
                        Data being fetched...
                    </div>
                )}
                {searchBool.current ? (
                    <div>
                        {searchResultValue.length !== 0 ? (
                            <div>
                                <br/>
                                <div>
                                    Search Results: {searchResultValue.length} items found
                                    <br/>
                                    <br/>
                                </div>
                                <div>
                                    {searchResultValue.map(v => {
                                        return (
                                            <div key={v.id}>
                                                <div>
                                                    <input type='radio' name="SelectMovie" onChange={e => {
                                                        setMovieBeingSearched(v.title);
                                                        movieDataFetched.current = false;
                                                        setMovieRating('');
                                                        setMovieActors([]);
                                                        setMovieGenres('');
                                                        setDataClear(!dataClear);
                                                    }}/>
                                                    {v.title}
                                                </div>
                                                <div>
                                                    {v.title === movieBeingSearched ? (
                                                        <div>
                                                            <div>
                                                                <button style={{background: "LightGreen", fontWeight: "bold"}} onClick={findResults}>Find Results</button>
                                                            </div>
                                                            <div>
                                                                {movieDataFetched.current ? (
                                                                    <div>
                                                                        <hr style={{backgroundColor: 'black', height: 5}}/>
                                                                        <br/>
                                                                        {(ratingFetched.current && actorsFetched.current && genresFetched.current) ? (
                                                                            <div>
                                                                                Rating: {movieRating}
                                                                                <br/>
                                                                                Genre: {movieGenre}
                                                                                <br/>
                                                                                Familiar Actors:
                                                                                {movieActors.length === 0 ? (
                                                                                    <div>
                                                                                        <ul>Fetching Actors...(be patient, might take a minute)</ul>
                                                                                    </div>
                                                                                ) : null}
                                                                                {movieActors.map(a => {
                                                                                    return (
                                                                                        <div key={a.primaryname}>
                                                                                            <ul><li>{a.primaryname}</li></ul>
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                Fetching Movie Data... (be patient, might take a minute)
                                                                            </div>
                                                                        )}
                                                                        <br/>
                                                                        <br/>
                                                                        <hr style={{backgroundColor: 'black', height: 5}}/>
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    ) : null}

                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <br/>
                                Search Results: {searchResultValue.length} items found
                                <br/>
                                <br/>
                            </div>
                        )}
                    </div>
                ): null}
            </div>
        </div>
    );
}

export default App;
