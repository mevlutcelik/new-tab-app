'use client'
import { useEffect, useState } from 'react'
import { Settings, MoreHorizontal } from 'lucide-react'
import { LiquidButton } from '@/components/liquid-button'
import { getFaviconUrl } from '@/utils/validators'
import { getBase64Icon } from '@/utils/getBase64Icon'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

const Header = ({ favorites = [], onOpenSettings, weather, target }) => {
  const [maxVisible, setMaxVisible] = useState(8)

  // Ekran boyutuna göre görünür favori sayısını belirle
  useEffect(() => {
    const updateMaxVisible = () => {
      if (window.innerWidth < 640) {
        // Tailwind sm breakpoint: 640px
        setMaxVisible(3)
      } else {
        setMaxVisible(8)
      }
    }

    updateMaxVisible()
    window.addEventListener('resize', updateMaxVisible)
    return () => window.removeEventListener('resize', updateMaxVisible)
  }, [])

  const visibleFavorites = favorites.slice(0, maxVisible)
  const overflowFavorites = favorites.slice(maxVisible)

  return (
    <header className="flex items-center justify-between gap-6 px-4 py-2 text-white">
      {/* Sol: Ayar butonu */}
      <div className="flex items-center gap-3">
        <LiquidButton
          variant="primary"
          size="sm"
          tabIndex={0}
          role="button"
          onClick={onOpenSettings}
          rippleEffect={false}
          className="shadow-2xl w-10 h-10 !p-0 !rounded-full flex items-center justify-center m-2 transition-all duration-300"
        >
          <Settings className="size-4" />
        </LiquidButton>
      </div>

      {/* Orta: Favori linkler */}
      <div className="flex items-center relative">
        {visibleFavorites.map((button, index) => (
          <LiquidButton
            key={`${button.url}-${index}`}
            variant="primary"
            size="sm"
            tabIndex={0}
            role="button"
            onClick={() => {
              target ? window.open(button.url, target) : (window.location.href = button.url)
            }}
            rippleEffect={false}
            className="shadow-2xl w-10 h-10 !p-0 !rounded-full flex items-center justify-center m-2 transition-all duration-300"
          >
            <div
              style={{ backgroundImage: `url(${getFaviconUrl(button.url)})` }}
              className="bg-cover bg-no-repeat w-5 h-5"
            ></div>
          </LiquidButton>
        ))}

        {overflowFavorites.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <LiquidButton
                variant="primary"
                size="sm"
                tabIndex={0}
                role="button"
                rippleEffect={false}
                onKeyDown={(e) => {}}
                className="shadow-2xl w-10 h-10 !p-0 !rounded-full flex items-center justify-center m-2 transition-all duration-300"
              >
                <MoreHorizontal className="size-4" />
              </LiquidButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black z-50" align="end">
              {overflowFavorites.map((button, index) => (
                <DropdownMenuItem
                  key={`${button.url}-${index}`}
                  onClick={() => {
                    target ? window.open(button.url, target) : (window.location.href = button.url)
                  }}
                  className="cursor-pointer"
                >
                  <img
                    src={getFaviconUrl(button.url)}
                    alt=""
                    className="w-4 h-4 mr-2"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  {button.title || button.url}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Sağ: Hava durumu */}
      <div className="flex items-center gap-2 text-sm">
        {weather ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-1 justify-end">
              <div
                style={{ backgroundImage: `url(${getBase64Icon(weather.weather[0].icon)})` }}
                className="size-5 bg-cover"
              />
              <div className="font-semibold">{Math.round(weather.main.temp)}&#176;C</div>
            </div>
            <div className="text-xs">
              {weather.name}, {weather.sys.country}
            </div>
          </div>
        ) : (
          <span>Hava durumu yükleniyor...</span>
        )}
      </div>
    </header>
  )
}

export default Header