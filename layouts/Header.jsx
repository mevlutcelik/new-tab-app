'use client'
import { use, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Settings, Instagram, Moon } from 'lucide-react'
import { LiquidButton } from '@/components/liquid-button'
import ChatGPT from '@/icons/chatgpt'
import YouTube from '@/icons/youtube'
import Facebook from '@/icons/facebook'

const Header = () => {

    const buttons = [
        {
            id: 'instagram',
            icon: Instagram,
            label: 'Instagram',
            useStroke: true,
        },
        {
            id: 'chat',
            icon: ChatGPT,
            label: 'AirDrop',
            useStroke: false,
        },
        {
            id: 'youtube',
            icon: YouTube,
            label: 'Youtube',
            useStroke: false,
        },
        {
            id: 'dnd',
            icon: Facebook,
            label: 'Do Not Disturb',
            useStroke: false,
        },
    ]

    return (
        <header className="flex items-center justify-between gap-6 px-4 py-2 text-white">
            {/* Sol: Ayar butonu */}
            <div className="flex items-center gap-3">
                <Button variant="glass" className="size-11">
                    <Settings className="size-4" />
                </Button>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="glass" className="size-10">
                    <Moon className="size-4" />
                </Button>
            </div>

            <div className='flex items-center gap-3'>
                {buttons.map((button) => {
                    const IconComponent = button.icon
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
                                margin: 0,
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
                                fill={button.useStroke ? 'none' : 'white'}
                                strokeWidth={button.useStroke ? 2 : 0}
                            />
                        </LiquidButton>
                    )
                })}
            </div>

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
