import { useState } from 'react'
import { BrowserRouter, Route, Routes  } from 'react-router-dom'
import Home from './components/Home'
import Shop from './components/Shop'
import Product from './components/Product'
import Cart  from './components/Cart'
import Checkout from './components/Checkout'
import Login from './components/admin/Login'
 import { ToastContainer, toast } from 'react-toastify';
 import Dashboard from './components/admin/Dashboard'
import { AdminRequireAuth } from './components/admin/AdminrequireAuth'

import {default as ShowCategories} from './components/admin/category/Show'
import {default as CreateCategory} from './components/admin/category/Create'
import {default as EditCategory} from './components/admin/category/Edit'

import {default as ShowBrands} from './components/admin/brand/Show'
import {default as CreateBrand} from './components/admin/brand/Create'
import {default as EditBrand} from './components/admin/brand/Edit'

import {default as ShowProducts} from './components/admin/product/Show'
import {default as CreateProduct} from './components/admin/product/Create'
import {default as EditProduct} from './components/admin/product/Edit'
import Register from './components/Register'
import {default as UserLogin} from './components/Login'
import Profile from './components/Profile'
import { RequireAuth } from './components/RequireAuth'
import Confirmation from './components/OrderConfirmation'
import ForgetPassword from './components/ForgetPassword'
import ResetPassword from './components/ResetPassword'
import ShowOrders from './components/admin/orders/ShowOrders'
import OrderDetail from './components/admin/orders/OrderDetail'
import OrderConfirmation from './components/OrderConfirmation'

function App() {
 
  return (
    <>
    <BrowserRouter>
        <Routes>
          {/* User Routes */}
               <Route path='/' element={<Home/>}/>
               <Route path='/Shop' element={<Shop/>}/>
               <Route path='/product/:id' element={<Product/>}/>
               <Route path='/cart' element={<Cart/>}/>
               {/* <Route path='/checkout' element={<Checkout/>}/> */}
               <Route path='/account/register' element={<Register/>}/>
               <Route path='/account/login' element={<UserLogin/>}/>
               <Route path='/account/forget-password' element={<ForgetPassword/>}/>
               <Route path='/password/reset' element={<ResetPassword/>}/>
               
               <Route path='/admin/login' element={<Login/>}/>

               {/* <Route path="/order/confirmation/:id" element={<OrderConfirmation />} /> */}


                 <Route path='/account' element={
                  <RequireAuth>
                  <Profile/>
                </RequireAuth>
              }/>

               <Route path='/checkout' element={
                  <RequireAuth>
                  <Checkout/>
                </RequireAuth>
              }/>
                

                <Route path='/order/confirmation/:id' element={
                  <RequireAuth>
                  <Confirmation/>
                </RequireAuth>
              }/>

                    {/* Admins Routes */}
                <Route path='/admin/dashboard' element={
                  <AdminRequireAuth>
                  <Dashboard/>
                </AdminRequireAuth>
              }/>


                   <Route path='/admin/categories' element={
                    <AdminRequireAuth>
                  <ShowCategories/>
                </AdminRequireAuth>
              }/>

                 <Route path='/admin/categories/create' element={
                    <AdminRequireAuth>
                  <CreateCategory/>
                </AdminRequireAuth>
              }/>

              <Route path='/admin/categories/edit/:id' element={
                    <AdminRequireAuth>
                  <EditCategory/>
                </AdminRequireAuth>
              }/>

              <Route path='/admin/brands' element={
                    <AdminRequireAuth>
                  <ShowBrands/>
                </AdminRequireAuth>
              }/>

              <Route path='/admin/brands/create' element={
                    <AdminRequireAuth>
                  <CreateBrand/>
                </AdminRequireAuth>
              }/>

              <Route path='/admin/brands/edit/:id' element={
                    <AdminRequireAuth>
                  <EditBrand/>
                </AdminRequireAuth>
              }/>

              <Route path='/admin/products' element={
                    <AdminRequireAuth>
                  <ShowProducts/>
                </AdminRequireAuth>
              }/>

              <Route path='/admin/products/create' element={
                    <AdminRequireAuth>
                  <CreateProduct/>
                </AdminRequireAuth>
              }/>

              <Route path='/admin/products/edit/:id' element={
                    <AdminRequireAuth>
                  <EditProduct/>
                </AdminRequireAuth>
              }/>

               <Route path='/admin/orders' element={
                    <AdminRequireAuth>
                  <ShowOrders/>
                </AdminRequireAuth>
              }/>


               <Route path='/admin/orders/:id' element={
                    <AdminRequireAuth>
                  <OrderDetail/>
                </AdminRequireAuth>
              }/>

              <Route path='forget-password'>

              </Route>

        </Routes>
    </BrowserRouter>
    <ToastContainer />
     
    </>
  )
}

export default App
