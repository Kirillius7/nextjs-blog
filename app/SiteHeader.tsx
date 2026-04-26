'use client';
import Image from 'next/image';
import { useState } from 'react';
export default function SiteHeader(){
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenSettings, setIsOpenSettings] = useState(false);
    function toggleMenu() {
      setIsOpen(!isOpen);
    }
    
  function toggleSettings(){
    setIsOpenSettings(!isOpenSettings)
  }
return <header className="bg-gray-900 sm:flex sm:items-center xl:flex-shrink-0 sm:justify-between xl:bg-white">
        <div className="flex items-center justify-between px-4 py-3 xl:w-72 xl:bg-gray-900 xl:justify-center">
  {/* Контейнер логотипу */}
  <div className="flex xl:px-0"> 
    <Image 
      src="/workcation.jpg" 
      alt="My photo"
      width={250}
      height={50}
      className="mx-auto" // Гарантує центрування всередині, якщо ширина дозволяє
    />
  </div>

  {/* Контейнер кнопки — на xl він має зникати повністю */}
  <div className="flex pr-3 py-2 xl:hidden"> 
    <button 
      onClick={toggleMenu} 
      type="button" 
      className="text-gray-900 py-2 bg-gray-400 rounded-full w-16 sm:hidden"
    >
      {!isOpen ? "Menu" : "Close"}
    </button>
  </div>
</div>
<nav className={`sm:flex sm:items-center xl:flex-1 xl:justify-between sm:justify-between ${isOpen ? 'block' : 'hidden'}`}>
  <div className="xl:ml-4">
    <div className="relative w-62 hidden xl:block">
              <div className="absolute inset-y-0 left-0 flex items center pl-3">
                <div className="text-gray-400 mt-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 10a7 7 0 1 0 14 0 7 7 0 1 0 -14 0" strokeWidth="2" />
                    <path d="m21 21 -6 -6" strokeWidth="2" />
                </svg>
                </div>
              </div>
              <input className="block w-full focus:outline-none focus:text-gray-900 focus:bg-white bg-gray-900 text-white rounded-lg pl-12 pr-3 py-2 xl:bg-gray-200 xl:text-gray-900" placeholder="Search by keywords"/>
    </div>
  </div>
  <div className="sm:flex sm:items-center">
  {/* Основні посилання */}
  <div className="px-2 py-3 flex flex-col border-b border-gray-800 sm:flex-row sm:border-none sm:py-0 sm:items-center sm:gap-4">
    <a href="#" className="px-2 py-1 mt-4 sm:mt-0 text-white text-xl sm:text-sm xl:text-gray-900 font-semibold rounded-lg hover:bg-gray-500 whitespace-nowrap"> 
      List your property
    </a>
    <a href="#" className="px-2 py-1 mt-4 sm:mt-0 text-white text-xl sm:text-sm xl:text-gray-900 font-semibold rounded-lg hover:bg-gray-500"> 
      Trips
    </a>
    <a href="#" className="px-2 py-1 mt-4 sm:mt-0 text-white text-xl sm:text-sm xl:text-gray-900 font-semibold rounded-lg hover:bg-gray-500"> 
      Messages
    </a>
  </div>

  {/* Блок профілю */}
  <div className="px-4 py-4 relative sm:py-0 sm:px-2">
    <div className="flex items-center">
      <button
      onClick={toggleSettings}
      className="block focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
    >
      <div className="relative h-8 w-8 sm:h-10 sm:w-10"> 
        {/* Фіксуємо розмір: на мобільних 32px (h-8), на sm+ 40px (sm:h-10) */}
        <Image 
          src="/a woman.jpg" 
          alt="Woman"
          fill // Використовуємо fill для заповнення контейнера
          className="rounded-full border-2 border-gray-600 object-cover"
        />
      </div>
    </button>
      {/* Ім'я ховаємо на десктопі, бо там лише аватар */}
      <span className="ml-3 text-gray-300 font-bold text-xl sm:hidden">Isla Schoger</span>
    </div>

    {/* Випадаюче меню налаштувань */}
    {isOpenSettings && (
      <div className="mt-5 bg-gray-800 sm:bg-white rounded-lg shadow-xl w-48 py-2 px-2 z-50 
                      static sm:absolute sm:right-0 sm:mt-3 border border-gray-700 sm:border-none">
        <a href="#account" className="px-2 py-2 block font-semibold text-gray-300 sm:text-gray-600 hover:bg-indigo-500 hover:text-white rounded-lg"> 
          Account settings 
        </a>
        <a href="#support" className="px-2 py-2 block font-semibold text-gray-300 sm:text-gray-600 hover:bg-indigo-500 hover:text-white rounded-lg"> 
          Support 
        </a>
        <a href="#sign-out" className="px-2 py-2 block font-semibold text-gray-300 sm:text-gray-600 hover:bg-indigo-500 hover:text-white rounded-lg"> 
          Sign out 
        </a>
      </div>
    )}
  </div>    
  </div>

</nav>

      </header>
}
