import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory } from 'react-router-dom'
import Navigation from './component/Navigation'
import Home from './component/Home'
import Completion from './component/Completion'
import Form from './component/Form'
import * as yup from 'yup'
import axios from 'axios'
import './App.css'


const initialForm = {
  name: '',
  size: '',
  pepperoni: false,
  sausage: false,
  onion: false,
  mushroom: false,
  instructions: '',
};
const Schema = yup.object().shape({
  name: yup
  .string()
  .required('Name is required')
  .min(2, 'name must be at least 2 characters'),
  size: yup.string(),
  pepperoni: yup.string(),
  sausage: yup.string(),
  mushroom: yup.string(),
  onion: yup.string(),
  instructions: yup.string(),
})

const App = () => {
  const [form, setForm]= useState([]);
  const [pizza, setPizza] = useState([]);
  const [disabled, setDisabled] = useState(true)
  const [errors, setErrors] = useState(initialForm)
  
  const history = useHistory()
  
  useEffect(() =>{
    Schema.isValid(form)
    .then(valid => setDisabled(!valid))
  },[form])
  

  const validateForm = (e) => {
    yup
    .reach(Schema, e.target.name)
    .validate(e.target.type === 'checkbox' ? e.target.checked : e.target.value)
    .then(() => setErrors({...errors, [e.target.name]: ''}))
    .catch(err => setErrors({...errors, [e.target.name] : err.errors}))
  }

  const handleChange = (item) => {
    item.persist()
    item.target.type === 'checkbox' 
    ? setForm({...form, [item.target.name]: item.target.checked})
    : setForm({...form, [item.target.name]: item.target.value})
    validateForm(item);
  }

  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://reqres.in/api/orders', form)
    .then(res =>{
      setPizza([...pizza, res.data])
      setForm(initialForm)
      history.push('/complete')
    })
    .catch(err =>{
      console.log(err)
                                
    })
  }
  console.log(errors)
  return (
<>
    <>
    <div className="header">
      <h1>Order Pizza </h1>
      </div>
    </>
    <div>
      <Navigation />
      {errors.name.length > 0 && <p>{errors.name}</p>}
      <Switch>
        <Route path ='/pizza'>
          <Form id='pizza-form'
          form={form} 
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          disabled={disabled}
          />
        </Route>
        <Route path ='/complete'>
          <Completion
          pizza={pizza}
          />
        </Route>
        <Route  path ='/'>
          <Home/>
        </Route>
      </Switch>
    </div>
    </>
  );
};
export default App;
