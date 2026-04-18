const SIZE_CLASS = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-10 h-10',
}

export function JokerLogo({ size = 'sm', className = '' }) {
  const s = SIZE_CLASS[size] || SIZE_CLASS.sm
  return (
    <img
      src="/images/joker.png"
      alt="Joker Crescendo"
      className={`inline-block align-[-0.15em] ${s} ${className}`}
    />
  )
}
