"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useLanguage } from '@/lib/language-context'
import { 
  Globe, 
  Book, 
  Volume2, 
  HelpCircle, 
  Sparkles,
  Languages,
  Info
} from 'lucide-react'

interface TranslationHelperProps {
  term: string
  context?: 'educational' | 'gaming' | 'technical' | 'general'
  showPronunciation?: boolean
  children?: React.ReactNode
}

export function TranslationHelper({ 
  term, 
  context = 'general', 
  showPronunciation = true,
  children 
}: TranslationHelperProps) {
  const { currentLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  // Enhanced Odia translations with context and pronunciation
  const contextualTranslations: Record<string, { 
    or: string
    pronunciation: string
    context: string
    examples: string[]
  }> = {
    'dashboard': {
      or: 'ଡ୍ୟାସବୋର୍ଡ',
      pronunciation: 'ḍyāsabōrḍa',
      context: 'ଏକ ନିୟନ୍ତ୍ରଣ କେନ୍ଦ୍ର ଯେଉଁଠାରେ ସମସ୍ତ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ତଥ୍ୟ ଦେଖାଯାଏ',
      examples: ['ଛାତ୍ର ଡ୍ୟାସବୋର୍ଡ', 'ଶିକ୍ଷକ ଡ୍ୟାସବୋର୍ଡ', 'ପ୍ରଗତି ଡ୍ୟାସବୋର୍ଡ']
    },
    'analytics': {
      or: 'ବିଶ୍ଳେଷଣ',
      pronunciation: 'biśleṣaṇa',
      context: 'ତଥ୍ୟ ଏବଂ ତଥ୍ୟର ବିସ୍ତୃତ ଅଧ୍ୟୟନ ଏବଂ ବିଶ୍ଳେଷଣ',
      examples: ['କାର୍ଯ୍ୟଦକ୍ଷତା ବିଶ୍ଳେଷଣ', 'ଅଗ୍ରଗତି ବିଶ୍ଳେଷଣ', 'ଫଳାଫଳ ବିଶ୍ଳେଷଣ']
    },
    'gamification': {
      or: 'ଖେଳିକରଣ',
      pronunciation: 'kheḷikaraṇa',
      context: 'ଶିକ୍ଷାକୁ ଖେଳ ପରି ମଜାଦାର ଏବଂ ଆକର୍ଷଣୀୟ କରିବା',
      examples: ['ପଏଣ୍ଟ ସିଷ୍ଟମ', 'ବ୍ୟାଜ ପୁରସ୍କାର', 'ଲିଡରବୋର୍ଡ']
    },
    'performance': {
      or: 'କାର୍ଯ୍ୟଦକ୍ଷତା',
      pronunciation: 'kāryyadakṣatā',
      context: 'କେତେ ଭଲ କାମ କରାଯାଇଛି ତାହାର ମାପଦଣ୍ଡ',
      examples: ['ପରୀକ୍ଷା କାର୍ଯ୍ୟଦକ୍ଷତା', 'ଖେଳ କାର୍ଯ୍ୟଦକ୍ଷତା', 'ଶିକ୍ଷା କାର୍ଯ୍ୟଦକ୍ଷତା']
    },
    'achievement': {
      or: 'ସଫଳତା',
      pronunciation: 'saphalatā',
      context: 'ଲକ୍ଷ୍ୟ ପୂରଣ କରିବା କିମ୍ବା କିଛି ବିଶେଷ ପ୍ରାପ୍ତି',
      examples: ['ଶିକ୍ଷଣ ସଫଳତା', 'ଖେଳ ସଫଳତା', 'ମାସିକ ସଫଳତା']
    },
    'assignment': {
      or: 'ଆସାଇନମେଣ୍ଟ',
      pronunciation: 'āsāinameṇṭa',
      context: 'ଶିକ୍ଷକଙ୍କ ଦ୍ୱାରା ଦିଆଯାଇଥିବା କାମ ବା ପ୍ରକଳ୍ପ',
      examples: ['ଗଣିତ ଆସାଇନମେଣ୍ଟ', 'ଇତିହାସ ଆସାଇନମେଣ୍ଟ', 'ସାପ୍ତାହିକ ଆସାଇନମେଣ୍ଟ']
    },
    'leaderboard': {
      or: 'ଲିଡରବୋର୍ଡ',
      pronunciation: 'liḍarabōrḍa',
      context: 'ସର୍ବୋଚ୍ଚ ସ୍କୋରକାରୀଙ୍କ ତାଲିକା',
      examples: ['ସାପ୍ତାହିକ ଲିଡରବୋର୍ଡ', 'ମାସିକ ଲିଡରବୋର୍ଡ', 'ଖେଳ ଲିଡରବୋର୍ଡ']
    },
    'notification': {
      or: 'ବିଜ୍ଞପ୍ତି',
      pronunciation: 'bijnnapti',
      context: 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ତଥ୍ୟ ବା ଅଦ୍ୟତନ ସୂଚନା',
      examples: ['ନୂତନ ବିଜ୍ଞପ୍ତି', 'ପରୀକ୍ଷା ବିଜ୍ଞପ୍ତି', 'ସିଷ୍ଟମ ବିଜ୍ଞପ୍ତି']
    }
  }

  const getTranslationData = () => {
    const data = contextualTranslations[term.toLowerCase()]
    if (data && currentLanguage.code === 'or') {
      return data
    }
    return null
  }

  const translationData = getTranslationData()

  if (!translationData || currentLanguage.code !== 'or') {
    return children || <span>{term}</span>
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="h-auto p-1 font-normal">
            <span className="underline decoration-dotted decoration-primary/50">
              {translationData.or}
            </span>
            <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            ଶବ୍ଦ ସହାୟକ
          </DialogTitle>
          <DialogDescription>
            ଶବ୍ଦର ଅର୍ଥ ଏବଂ ବ୍ୟବହାର ବିଷୟରେ ଜାଣନ୍ତୁ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Term */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">English</Badge>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="font-medium text-lg">{term}</p>
            </CardContent>
          </Card>

          {/* Odia Translation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="default" className="text-xs bg-primary">ଓଡ଼ିଆ</Badge>
                {showPronunciation && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2"
                    onClick={() => {
                      // Text-to-speech for Odia (if available)
                      if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(translationData.or)
                        utterance.lang = 'or-IN'
                        speechSynthesis.speak(utterance)
                      }
                    }}
                  >
                    <Volume2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <p className="font-medium text-lg mb-2">{translationData.or}</p>
              {showPronunciation && (
                <p className="text-xs text-muted-foreground italic">
                  ଉଚ୍ଚାରଣ: {translationData.pronunciation}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Context & Meaning */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Book className="h-4 w-4" />
                ଅର୍ଥ ଏବଂ ବ୍ୟାଖ୍ୟା
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{translationData.context}</p>
            </CardContent>
          </Card>

          {/* Usage Examples */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                ବ୍ୟବହାର ଉଦାହରଣ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {translationData.examples.map((example, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    <span className="text-sm">{example}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Tip */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-xs font-medium text-primary">ଟିପ୍ସ</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ଏହି ଶବ୍ଦର ଅର୍ଥ ବୁଝିବା ପାଇଁ ପ୍ରସଙ୍ଗ ଅତ୍ୟନ୍ତ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ। ବିଭିନ୍ନ ପରିସ୍ଥିତିରେ ଏହାର ବ୍ୟବହାର ଅଲଗା ହୋଇପାରେ।
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Export utility function for quick translations
export const getOdiaTranslation = (term: string): string => {
  const translations: Record<string, string> = {
    'dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'analytics': 'ବିଶ୍ଳେଷଣ',
    'performance': 'କାର୍ଯ୍ୟଦକ୍ଷତା',
    'achievement': 'ସଫଳତା',
    'assignment': 'ଆସାଇନମେଣ୍ଟ',
    'leaderboard': 'ଲିଡରବୋର୍ଡ',
    'notification': 'ବିଜ୍ଞପ୍ତି',
    'gamification': 'ଖେଳିକରଣ',
    'progress': 'ପ୍ରଗତି',
    'settings': 'ସେଟିଂ',
    'profile': 'ପ୍ରୋଫାଇଲ୍',
    'games': 'ଖେଳ',
    'lessons': 'ପାଠ',
    'students': 'ଛାତ୍ରମାନେ',
    'teachers': 'ଶିକ୍ଷକମାନେ',
    'reports': 'ରିପୋର୍ଟସମୂହ',
    'insights': 'ଅନ୍ତର୍ଦୃଷ୍ଟି',
    'overview': 'ସାରାଂଶ'
  }
  
  return translations[term.toLowerCase()] || term
}