import React from 'react'
import Layout from './common/Layout'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { apiUrl } from './common/http'

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const navigate = useNavigate()
  const location = useLocation()

  // Extract token and email from query params
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')
  const email = queryParams.get('email')

  const onSubmit = async (data) => {
    const payload = {
      email: email,
      token: token,
      password: data.password,
      password_confirmation: data.password_confirmation
    }

    const response = await fetch(`${apiUrl}/account/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (response.ok) {
      toast.success(result.message)
      navigate('/admin/login') // redirect to login page
    } else {
      toast.error(result.message || 'Something went wrong')
    }
  }

  return (
    <Layout>
      <div className='container d-flex justify-content-center py-5'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='card shadow border-0 login'>
            <div className='card-body p-4'>
              <h3 className='border-bottom pb-2 mb-3 text-center'>Reset Password</h3>

              {/* New Password */}
              <div className='mb-3'>
                <label className='form-label'>New Password</label>
                <input
                  type='password'
                  className={`form-control ${errors.password && 'is-invalid'}`}
                  {...register('password', {
                    required: 'The password field is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  placeholder='Enter new password...'
                />
                {errors.password && (
                  <p className='invalid-feedback'>{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className='mb-3'>
                <label className='form-label'>Confirm Password</label>
                <input
                  type='password'
                  className={`form-control ${errors.password_confirmation && 'is-invalid'}`}
                  {...register('password_confirmation', {
                    required: 'Please confirm your password',
                    validate: value =>
                      value === watch('password') || 'Passwords do not match'
                  })}
                  placeholder='Confirm new password...'
                />
                {errors.password_confirmation && (
                  <p className='invalid-feedback'>
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              <button className='btn btn-secondary w-100'>Reset Password</button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default ResetPassword
