import React from 'react'
import appwriteService from '../appwrite/config'
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className='bg-black rounded-xl border border-gray-600 overflow-hidden hover:shadow-lg transition-shadow duration-300'>
        {/* Image Container */}
        <div className="w-full h-96 overflow-hidden flex justify-center items-center bg-black">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="h-auto w-full object-contain"
          />
        </div>

        {/* Title */}
        <div className='p-4'>
          <h2 className='text-xl text-slate-200 font-mono font-semibold'>
            {title}
          </h2>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
