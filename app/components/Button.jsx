export const CircleButton = ({ onClick, children, focusRing = false }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center size-10 rounded-full bg-white/5 text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none ${focusRing && 'focus:ring-2 focus:ring-white/10'}`}
        >
            {children}
        </button>
    );
};