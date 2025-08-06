import React, { useContext } from 'react'
import Layout from './common/Layout'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from './common/http';
import { toast } from 'react-toastify';
import { AuthContext } from './context/Auth';

const ForgetPassword = () => {

     const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();

      const {login} = useContext(AuthContext);

       const navigate = useNavigate();

  const onSubmit = async (data) => {
          console.log(data)
  
          const res = await fetch(`${apiUrl}/account/forget-password`,{
              method : 'POST',
              headers: {
                  'Content-type' : 'application/json'
              },
              body: JSON.stringify(data)
          }).then(res => res.json())
          .then(result =>{
              //console.log(result)
              if(result.status == 'success')
                toast.success(result.message);
            else
              toast.error(result.message);
          })
    }

  return (
     <Layout>

        <div className='container d-flex justify-content-center py-5'>
           <form onSubmit={handleSubmit(onSubmit)}>
                <div className='card shadow border-0 login'>
                    <div className='card-body p-4'>
                        <h3 className='border-bottom pb-2 mb-3 text-center'>Forget Password</h3>
                        <div className='mb-3'>
                            <label htmlFor="" className='form-label'>Email</label>
                            <input 
                                {
                                        ...register('email',{
                                            required: "The email field is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            } 
                                        })
                                    }
                            type="text"
                             className={`form-control ${errors.email && 'is-invalid'}`}
                              placeholder='Email....' />
                            {
                                errors.email &&  <p className='invalid-feedback'>{errors.email.message}</p>
                            }
                        </div>
                        
                        <button className='btn btn-secondary w-100'>Send Reset Password Link</button>
                    </div>

                </div>
                </form>
        </div>

    </Layout>
  )
}

export default ForgetPassword
