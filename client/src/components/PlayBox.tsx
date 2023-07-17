import React from 'react';

interface Props {
  title: string
}

export default function PlayBox({ title }: Props) {
  return (
    <section>
      <header className='flex justify-between'>
        <h3 className='text-2xl text-white font-bold hover:underline tracking-tight'>{title}</h3>
      </header>

    </section>

  )
}
