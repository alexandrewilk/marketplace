import React from 'react'

export default function SignIn() {
  return (
    <section>
      <h1 className='text-2xl text-center'>Sign IN</h1>
      <div>
        <div className='md:w-[67%] lg:w-[50%]'>
          <img src='https://images.unsplash.com/photo-1685280947549-a0ddbce42613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=900&q=60'
          className='w-full rounded'/>
        </div>
        <div>
          <form>
            <input type='text'/>
          </form>
        </div>
      </div>

    </section>
  )
}
