import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props
  const [enteredFilter, setEnterFiltered] = useState('')
  const inputRef = useRef()
   

  useEffect(() => {
    const timer = 
    setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = !enteredFilter.length ? '' : `?orderBy="title"&equalTo="${enteredFilter[0].toUpperCase() + enteredFilter.slice(1)}"`
        fetch('https://react-hooks-74169-default-rtdb.firebaseio.com/ingredients.json'+query)
          .then(response => response.json())
          .then(responseData =>  {
            const loadedIngredients = []
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              })
            }
            onLoadIngredients(loadedIngredients)
          })
          .catch(err => console.error(err))
      }
      return () => {
        clearTimeout(timer)
      }
    }, 500)
  }, [enteredFilter, onLoadIngredients, inputRef])
    
  console.log(enteredFilter)

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            value={enteredFilter} 
            onChange={e => setEnterFiltered(e.target.value)} 
            type="text" 
            ref={inputRef}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
