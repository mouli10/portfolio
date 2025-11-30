const Skeleton = ({ className = '', variant = 'rectangular' }) => {
    const baseClasses = 'animate-pulse bg-gray-700/50'

    const variantClasses = {
        rectangular: 'rounded',
        circular: 'rounded-full',
        text: 'rounded h-4',
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            aria-hidden="true"
        />
    )
}

export default Skeleton
