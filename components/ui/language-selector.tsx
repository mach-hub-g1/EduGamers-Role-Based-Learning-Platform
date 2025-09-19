"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useLanguage, supportedLanguages } from "@/lib/language-context"
import { Badge } from "@/components/ui/badge"
import { Globe, Check, Sparkles } from "lucide-react"
import { useState } from "react"

interface LanguageSelectorProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showFlag?: boolean
  showName?: boolean
  showNativeName?: boolean
}

export function LanguageSelector({ 
  variant = "outline", 
  size = "sm", 
  showFlag = true,
  showName = true,
  showNativeName = true
}: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, t } = useLanguage()
  const [isChanging, setIsChanging] = useState(false)

  const handleLanguageChange = async (language: typeof supportedLanguages[0]) => {
    setIsChanging(true)
    
    // Add a small delay for smooth transition
    setTimeout(() => {
      setLanguage(language)
      setIsChanging(false)
      
      // Show success feedback for Odia selection
      if (language.code === 'or') {
        // Could trigger a toast notification here
        console.log('ଓଡ଼ିଆ ଭାଷା ସଫଳତାର ସହିତ ବଦଳାଗଲା!')
      }
    }, 150)
  }

  const getLanguageDisplayName = (lang: typeof supportedLanguages[0]) => {
    if (currentLanguage.code === 'or') {
      // Provide Odia names for languages when current language is Odia
      const odiaNames: Record<string, string> = {
        'en': 'ଇଂରାଜୀ',
        'hi': 'ହିନ୍ଦୀ', 
        'or': 'ଓଡ଼ିଆ',
        'bn': 'ବାଙ୍ଗାଳୀ',
        'te': 'ତେଲୁଗୁ',
        'ta': 'ତାମିଲ',
        'gu': 'ଗୁଜରାଟୀ',
        'mr': 'ମରାଠୀ',
        'kn': 'କନ୍ନଡ଼',
        'ml': 'ମାଲାୟାଲମ୍'
      }
      return odiaNames[lang.code] || lang.name
    }
    return lang.name
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`gap-2 transition-all duration-200 hover:scale-105 ${
            isChanging ? 'opacity-70' : ''
          }`}
          disabled={isChanging}
        >
          <Globe className={`h-4 w-4 ${isChanging ? 'animate-spin' : ''}`} />
          {showFlag && (
            <span className="text-lg leading-none">{currentLanguage.flag}</span>
          )}
          {showNativeName && (
            <span className="hidden sm:inline font-medium">
              {currentLanguage.nativeName}
            </span>
          )}
          {showName && !showNativeName && (
            <span className="hidden sm:inline">
              {getLanguageDisplayName(currentLanguage)}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Globe className="h-3 w-3" />
          {currentLanguage.code === 'or' ? 'ଭାଷା ବାଛନ୍ତୁ' : 'Select Language'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Featured Odia Option */}
        {currentLanguage.code !== 'or' && (
          <>
            <DropdownMenuItem
              onClick={() => handleLanguageChange(supportedLanguages.find(l => l.code === 'or')!)}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 mb-2 hover:from-primary/10 hover:to-primary/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{supportedLanguages.find(l => l.code === 'or')?.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{supportedLanguages.find(l => l.code === 'or')?.nativeName}</span>
                  <span className="text-xs text-muted-foreground">
                    {getLanguageDisplayName(supportedLanguages.find(l => l.code === 'or')!)}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs ml-auto">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
          </>
        )}
        
        {/* All Language Options */}
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-muted/50 ${
              currentLanguage.code === language.code 
                ? 'bg-primary/10 border border-primary/30' 
                : 'border border-transparent'
            } ${
              language.code === 'or' && currentLanguage.code !== 'or' 
                ? 'hidden' // Hide duplicate Odia entry
                : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg leading-none">{language.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{language.nativeName}</span>
                <span className="text-xs text-muted-foreground">
                  {getLanguageDisplayName(language)}
                </span>
              </div>
            </div>
            {currentLanguage.code === language.code && (
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-primary" />
                <Badge variant="default" className="text-xs">
                  {currentLanguage.code === 'or' ? 'ସକ୍ରିୟ' : 'Active'}
                </Badge>
              </div>
            )}
          </DropdownMenuItem>
        ))}
        
        {/* Language Stats */}
        <DropdownMenuSeparator className="my-2" />
        <div className="px-3 py-2 text-xs text-muted-foreground text-center">
          {currentLanguage.code === 'or' 
            ? `${supportedLanguages.length} ଟି ଭାଷା ଉପଲବ୍ଧ` 
            : `${supportedLanguages.length} languages available`
          }
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}