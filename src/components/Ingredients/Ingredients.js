import React, { useCallback, useEffect, useReducer, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

  const ingredientReducer = (currentIngredients, action) => {
    switch(action.type) {
      case 'SET':
        return action.ingredients;
      case 'ADD':
        return [...currentIngredients, action.ingredient]
      case 'DELETE':
        return currentIngredients.filter(ing => ing.id !== action.id)
      default:
        throw new Error('should not get there')
    }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  // const [ userIngredients, setUserIngredients ] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients)
    dispatch({
      type: 'SET',
      ingredients: filteredIngredients
    })
  }, [])

  const addIngredientHandler = async (ingredient) => { 
    setIsLoading(true)
    fetch('https://react-hooks-74169-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'content-Type': 'application/json'
      }
    }).then(response => {
      setIsLoading(false)
     return  response.json()
    }).then(responseData => {
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients, 
      //     {
      //       id: responseData.name,
      //       ...ingredient
      //     }
      // ])
      dispatch({
        type: 'ADD',
        ingredient: {id: responseData.name, ...ingredient}
      })
    }).catch(err => setIsLoading(false))
  }

  const removeIngredientsHandler = (ingredientId) => {
    setIsLoading(true)
    fetch(`https://react-hooks-74169-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response =>{ 
      setIsLoading(false)
      // return setUserIngredients(prevIngredients => 
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId))  
      dispatch({
        type: 'DELETE',
        id: ingredientId
      })
    }).catch(err => {
      setIsLoading(false)
      setError(err.message)
    })
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientsHandler}/>
      </section>
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
    </div>
  );
}

export default Ingredients;