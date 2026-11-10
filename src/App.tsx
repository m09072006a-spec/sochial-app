
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import  Layout from './layout/layout'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Home from './pages/home/Home'
import { Toast, toast } from '@heroui/react';
import AuthContext from './context/AuthContext'
import ProtectedRoute from './components/Gate'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

import PostPage from './pages/postPage/postPage'


let client = new QueryClient()


  const Router =    createBrowserRouter( [ 


  {   path: "", element: <Layout/>, children :[  

  
  { path : "/home"  , element : <ProtectedRoute>  <Home/>  </ProtectedRoute>  },
  // {path: "/profile" , element : <profile/>},

  { path : "/login"  , element : <Login/>  },

    { path : "/signup"  , element : <Signup/>},
  { path : "/post/:id"  , element : <ProtectedRoute>  <PostPage/>  </ProtectedRoute>  },


  ]  },



  
] )





 


function App() {
  

  return (
    <>

<QueryClientProvider   client={client}>

 <AuthContext>
  
  <Toast.Provider placement='top' /> 



  <RouterProvider  router={Router}/>

 </AuthContext>

</QueryClientProvider>

    </> 
  )
}

export default App
