import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import {login as authLogin} from '../store/authSlice'
import {Button, Input, Logo, Select} from './index'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form'

function Login() {
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const login = async(data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
              const userData = await authService.getCurrentUser()
              if(userData) dispatch(authLogin(userData));
              navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className='flex items-center justify-center w-full min-h-screen'>
      <div className={`mx-auto w-full max-w-lg bg-gray-900 rounded-xl p-10 border`}>
        <div className='mb-2 flex justify-center'>
          <span className='inline-block w-full max-w-[100px]'>
            <Logo width='100%'/>
          </span>
        </div>
        <h2 className='text-2xl text-center font-bold leading-tight'>
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-slate-300 text-black/60">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-slate-100 transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
        <form
        onSubmit={handleSubmit(login)}
        className='mt-4'
        >
          <div className='space-y-5'>
            <Input
              label='Email: '
              type='email'
              placeholder='Enter your email'
              {...register('email', {
                  required: true,
                  validate: {
                      matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Invalid email address'
                  }
              })}
            />
            <Input
              label='Password: '
              type='password'
              placeholder='Enter your password'
              {...register('password', { required: true })}
            />
            <Button type='submit' className='w-full'>
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login