interface MenuProps {
    className?: string;
  }
  
  export default function Menu({ className }: MenuProps) {
    return (
      <div className={`sticky top-0 lg:top-12 z-50 flex justify-end w-full h-0 ${className || ''}`}>
        <nav>
          <img 
            src="/images/menu-b.png" 
            alt="menu-b" 
            className="
              w-25 px-2 lg:px-3 py-2
              lg:w-60 lg:px-6
              backdrop-blur-md backdrop-saturate-300 bg-white/25
            "
          />
        </nav>
      </div>
    );
  }