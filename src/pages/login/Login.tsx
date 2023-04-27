import React, { ChangeEvent, FormEvent, useState, useContext } from 'react'
import {Box, Button, Stack, TextField} from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Link} from 'react-router-dom';
import { onSignIn } from '../../db/firebase';
import {UserCredential} from 'firebase/auth';
import {AuthContext} from '@auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [ values, setValues ] = useState({ email: "", password: ""});
  const [ loading, setLoading ] = useState("Ingresar");
  const { dispatch } = useContext(AuthContext)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const key = e.target.name;
    const value = e.target.value;
    setValues({...values, [key]: value });
  }; 
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading("Loading...")
    try {
      const response: UserCredential = await onSignIn(values);
      dispatch({ type: "LOGIN", payload: { email: response.user.email as string, token: response.user.refreshToken }});
      navigate("/home");
      setLoading("Ingresar");
    } catch (error) {
      console.log(error);
      setLoading("Volver a intentar");
    }
  };

  return (
    <Stack component="form" spacing={2} onSubmit={(e) => handleSubmit(e)}>
      <TextField 
        size="small" 
        label="email"
        name="email"
        value={values.email}
        onChange={(e) => handleChange(e)} 
      />
      <TextField 
        size="small" 
        label="password"
        name="password"
        value={values.password}
        onChange={(e) => handleChange(e)} 
      />
      <Box component="section" display="flex" justifyContent="space-between" alignItems="center">
        <Link style={{ fontSize: "12px"}} to="/auth/register">¿Aun no tienes cuenta?</Link>
        <Button 
          size="small" 
          type="submit" 
          variant="outlined"
          endIcon={<KeyboardArrowUpIcon/>}
          sx={{
            background: "#fff",
            color:"#000",
            border: "1px solid #000",
            ':hover':{
              background: "#000",
              color: "#fff",
              border: "1px solid #000",
            }
          }}
          >
            {loading}
          </Button>
      </Box>
    </Stack>
  )
}

export default Login