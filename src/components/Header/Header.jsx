import React from 'react'
import { Logo, LogoutBtn, Container } from '../index'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const authStatus = useSelector(state => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  return (
    <header className='py-2 shadow border border-gray-600 rounded-xl'>
      <Container>
        <nav className='flex flex-col items-center justify-center sm:flex-row sm:justify-between'>
          <div className='ml-2'>
            <Link to='/' className='flex items-center'>
              <Logo />
              <div className='ml-2 text-lg font-semibold text-white'>Movies Blog App</div>
            </Link>
          </div>
          <ul className='flex flex-col sm:flex-row justify-center items-center w-full sm:w-auto text-slate-200 text-lg font-sans font-semibold'>
            {navItems.map((item) => (
              item.active ? (
                <li key={item.name}>
                  <button onClick={() => navigate(item.slug)} className='inline-block px-5 py-2 duration-200 hover:bg-gray-800 rounded-full'>
                    {item.name}
                  </button>
                </li>
              ) : null
            ))}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header