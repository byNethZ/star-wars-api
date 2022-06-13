import { useState, useEffect, useRef } from "react";
import { getCharacter, getPeople, searchCharacter } from "./api/people";
import "./App.css";
//import data from './data.json'

function App() {
  const inputSearch = useRef(null);
  const [textSearch, setTextSearch] = useState("");
  const [people, setPeople] = useState([]);
  const [errorState, setErrorState] = useState({ hasError: false });
  const [currentCharacter, setCurrentCharacter] = useState(1);
  const [details, setDetails] = useState({});

  const [page, setPage] = useState(1);

  useEffect(() => {
    getPeople(page)
      .then(setPeople)
      .catch(handleError);
  }, [page]);

  useEffect(() => {
    getCharacter(currentCharacter).then(setDetails).catch(handleError);
  }, [currentCharacter]);

  const handleError = (err) => {
    setErrorState({ hasError: true, message: err.message });
  };

  const showDetails = (character) => {
    const id = parseInt(character.url.split("/").slice(-2)[0]);
    setCurrentCharacter(id);
  };

  const onChangeTextSearch = (evt) => {
    evt.preventDefault();

    const text = inputSearch.current.value;
    setTextSearch(text);
    console.log(text);
  };

  const onSearchSubmit = (evt) => {
    if (evt.key !== "Enter") return;

    inputSearch.current.value = "";
    setDetails({});
    searchCharacter(textSearch)
      .then(setPeople)
      .catch(handleError);
  };

  const onChangePage = (next) => {
    if(!people.previous && page + next <= 0) return;
    if(!people.next && page + next >= 9) return;

    setPage(page + next);
  };

  return (
    <div>
      <input
        ref={inputSearch}
        onChange={onChangeTextSearch}
        onKeyDown={onSearchSubmit}
        type="text"
        placeholder="Busca un personaje"
      />
      <ul>
        {errorState.hasError && <div>{errorState.message}</div>}
        {people?.results?.map((character) => (
          <li key={character.name} onClick={() => showDetails(character)}>
            {character.name}
          </li>
        ))}
      </ul>

      <section>
        <button onClick={() => onChangePage(-1)}>Prev</button>
        {page}
        <button onClick={() => onChangePage(+1)}>Next</button>
      </section>
      {details && (
        <aside>
          <h1>{details.name}</h1>
          <ul>
            <li>height: {details.height}</li>
            <li>mass: {details.mass}</li>
            <li>Year of Birth: {details.birth_year}</li>
          </ul>
        </aside>
      )}
    </div>
  );
}

export default App;
