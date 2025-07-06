'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { Plane, Bluetooth, Wifi, Moon } from 'lucide-react'
import { LiquidButton } from '@/components/liquid-button'
import { LiquidGlass } from '@/components/liquid-glass'

const Header = () => {
    const [toggleStates, setToggleStates] = useState({
        airplane: false,
        airdrop: false,
        wifi: true,
        dnd: false,
    })

    const buttons = [
        {
            id: 'airplane',
            icon: Plane,
            label: 'Airplane Mode',
            activeBackground:
                'linear-gradient(135deg, rgba(249, 115, 22, 0.7) 0%, rgba(234, 88, 12, 0.7) 100%)',
            activeBorder: 'rgba(251, 146, 60, 0.8)',
            active: toggleStates.airplane,
        },
        {
            id: 'airdrop',
            icon: Bluetooth,
            label: 'AirDrop',
            activeBackground:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(37, 99, 235, 0.7) 100%)',
            activeBorder: 'rgba(96, 165, 250, 0.8)',
            active: toggleStates.airdrop,
        },
        {
            id: 'wifi',
            icon: Wifi,
            label: 'Wi-Fi',
            activeBackground:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(37, 99, 235, 0.7) 100%)',
            activeBorder: 'rgba(96, 165, 250, 0.8)',
            active: toggleStates.wifi,
        },
        {
            id: 'dnd',
            icon: Moon,
            label: 'Do Not Disturb',
            activeBackground:
                'linear-gradient(135deg, rgba(168, 85, 247, 0.7) 0%, rgba(147, 51, 234, 0.7) 100%)',
            activeBorder: 'rgba(196, 181, 253, 0.8)',
            active: toggleStates.dnd,
        },
    ]

    return (
        <header className="flex items-center justify-between gap-6 px-4 py-2 text-white">
            {/* Sol: Ayar butonu */}
            <div className="flex items-center gap-3">
                <Button variant="glass" className="size-10">
                    <Settings className="size-4" />
                </Button>
            </div>

            <LiquidGlass
                variant="panel"
                intensity="medium"
                rippleEffect={false}
                flowOnHover={false}
                stretchOnDrag={false}
                className="relative z-20 !p-2"
                style={{ padding: '24px', borderRadius: '64px' }}
            >
                <div className="flex relative">
                    {buttons.map((button) => {
                        const IconComponent = button.icon
                        const useStroke = button.id === 'wifi' || button.id === 'airdrop'
                        return (
                            <LiquidButton
                                key={button.id}
                                variant="primary"
                                size="sm"
                                onClick={() => { }}
                                rippleEffect={false}
                                className="shadow-2xl w-24 h-24 !p-0 !rounded-full flex items-center justify-center m-2 transition-all duration-300"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    padding: '0',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '8px',
                                    background: button.active
                                        ? button.activeBackground
                                        : undefined,
                                    borderColor: button.active ? button.activeBorder : undefined,
                                }}
                            >
                                <IconComponent
                                    className="pointer-events-none"
                                    size={20}
                                    color="white"
                                    fill={useStroke ? 'none' : 'white'}
                                    strokeWidth={useStroke ? 2 : 0}
                                />
                            </LiquidButton>
                        )
                    })}
                </div>
            </LiquidGlass>

            {/* Sağ: Ayar butonu */}
            <div className="flex items-center gap-3">
                <Button variant="glass" className="size-10">
                    <Settings className="size-4" />
                </Button>
            </div>
        </header>
    )
}

export default Header
