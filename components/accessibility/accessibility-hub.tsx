"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Wifi, WifiOff, Download, Upload, Globe, Volume2, 
  Eye, EyeOff, Languages, Heart, Shield, 
  Database, RefreshCw, CheckCircle, AlertCircle,
  Smartphone, Monitor, Headphones, Settings
} from 'lucide-react';
import { multiLanguageService, LanguageConfig } from '@/lib/multi-language-service';
import { offlineStorageService } from '@/lib/offline-storage-service';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  voiceAssistant: boolean;
  offlineMode: boolean;
  lowBandwidth: boolean;
  autoSync: boolean;
}

interface OfflineStats {
  totalItems: number;
  cacheSize: number;
  maxCacheSize: number;
  offlineLessons: number;
  pendingSync: number;
}

const AccessibilityHub: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [supportedLanguages, setSupportedLanguages] = useState<LanguageConfig[]>([]);
  const [selectedLanguageFamily, setSelectedLanguageFamily] = useState<string>('all');
  const [offlineStats, setOfflineStats] = useState<OfflineStats>({
    totalItems: 0,
    cacheSize: 0,
    maxCacheSize: 0,
    offlineLessons: 0,
    pendingSync: 0
  });
  
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    voiceAssistant: false,
    offlineMode: false,
    lowBandwidth: false,
    autoSync: true
  });

  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    initializeServices();
    loadUserSettings();
    updateNetworkStatus();
    
    // Network status listeners
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  const initializeServices = async () => {
    try {
      await multiLanguageService.initialize();
      await offlineStorageService.initializeDB();
      
      const languages = multiLanguageService.getSupportedLanguages();
      setSupportedLanguages(languages);
      setCurrentLanguage(multiLanguageService.getCurrentLanguage());
      
      const stats = await offlineStorageService.getStorageStats();
      setOfflineStats(stats);
    } catch (error) {
      console.error('Failed to initialize accessibility services:', error);
    }
  };

  const loadUserSettings = () => {
    const savedSettings = localStorage.getItem('accessibility_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const updateNetworkStatus = () => {
    setIsOnline(navigator.onLine);
  };

  const saveSettings = (newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    localStorage.setItem('accessibility_settings', JSON.stringify(newSettings));
    applyAccessibilitySettings(newSettings);
  };

  const applyAccessibilitySettings = (settings: AccessibilitySettings) => {
    // Apply font size
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
    
    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (settings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await multiLanguageService.setCurrentLanguage(languageCode);
      setCurrentLanguage(languageCode);
      
      // Trigger UI re-translation
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: languageCode }));
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const handleOfflineDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      // Simulate progressive download of essential content
      const essentialContent = [
        'Basic Mathematics Lessons',
        'Science Fundamentals', 
        'Language Arts',
        'Cultural Elements Database',
        'Achievement System Data'
      ];
      
      for (let i = 0; i < essentialContent.length; i++) {
        // Simulate downloading content
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store offline lesson simulation
        await offlineStorageService.storeOfflineLesson({
          id: `offline_${i}`,
          title: essentialContent[i],
          content: `Offline content for ${essentialContent[i]}`,
          subject: essentialContent[i].split(' ')[0],
          grade: 'all'
        });
        
        setDownloadProgress(((i + 1) / essentialContent.length) * 100);
      }
      
      // Update stats
      const updatedStats = await offlineStorageService.getStorageStats();
      setOfflineStats(updatedStats);
      
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    try {
      await offlineStorageService.syncWhenOnline();
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setSyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Update stats
      const updatedStats = await offlineStorageService.getStorageStats();
      setOfflineStats(updatedStats);
      
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getLanguagesByFamily = (family: string) => {
    if (family === 'all') return supportedLanguages;
    return supportedLanguages.filter(lang => lang.family === family);
  };

  const getLanguageFamilies = () => {
    const families = [...new Set(supportedLanguages.map(lang => lang.family))];
    return families;
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Accessibility Hub</h1>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge variant="default" className="flex items-center gap-1">
              <Wifi className="w-4 h-4" />
              Online
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <WifiOff className="w-4 h-4" />
              Offline
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="language" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="language">Multi-Language</TabsTrigger>
          <TabsTrigger value="offline">Offline Mode</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="language" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Language Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Language Family</label>
                  <select 
                    value={selectedLanguageFamily}
                    onChange={(e) => setSelectedLanguageFamily(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">All Languages</option>
                    {getLanguageFamilies().map(family => (
                      <option key={family} value={family}>
                        {family.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {getLanguagesByFamily(selectedLanguageFamily).map(language => (
                    <div 
                      key={language.code}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        currentLanguage === language.code 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleLanguageChange(language.code)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{language.name}</div>
                          <div className="text-sm text-gray-600">{language.nativeName}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {language.isIndigenous && (
                            <Badge variant="secondary" className="text-xs">Indigenous</Badge>
                          )}
                          {language.voiceSupport && (
                            <Volume2 className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      {language.culturalContext.preservationStatus !== 'stable' && (
                        <div className="mt-2">
                          <Badge 
                            variant={language.culturalContext.preservationStatus === 'critically_endangered' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {language.culturalContext.preservationStatus.replace('_', ' ')}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Language Preservation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {supportedLanguages.filter(l => l.culturalContext.preservationStatus === 'stable').length}
                    </div>
                    <div className="text-sm text-green-700">Stable Languages</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {supportedLanguages.filter(l => l.culturalContext.preservationStatus === 'endangered').length}
                    </div>
                    <div className="text-sm text-yellow-700">Endangered</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Indigenous Languages</h4>
                  {multiLanguageService.getIndigenousLanguages().slice(0, 5).map(language => (
                    <div key={language.code} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{language.name}</div>
                        <div className="text-xs text-gray-600">
                          {language.culturalContext.speakers.toLocaleString()} speakers
                        </div>
                      </div>
                      <Badge 
                        variant={language.culturalContext.preservationStatus === 'critically_endangered' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {language.culturalContext.preservationStatus.split('_')[0]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Offline Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{offlineStats.offlineLessons}</div>
                    <div className="text-sm text-blue-700">Offline Lessons</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatFileSize(offlineStats.cacheSize)}
                    </div>
                    <div className="text-sm text-purple-700">Cache Used</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage Usage</span>
                    <span>{Math.round((offlineStats.cacheSize / offlineStats.maxCacheSize) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(offlineStats.cacheSize / offlineStats.maxCacheSize) * 100} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-600">
                    {formatFileSize(offlineStats.cacheSize)} / {formatFileSize(offlineStats.maxCacheSize)}
                  </div>
                </div>

                <Button 
                  onClick={handleOfflineDownload}
                  disabled={isDownloading}
                  className="w-full"
                >
                  {isDownloading ? (
                    <>
                      <Download className="w-4 h-4 mr-2 animate-spin" />
                      Downloading... {Math.round(downloadProgress)}%
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Essential Content
                    </>
                  )}
                </Button>

                {isDownloading && (
                  <Progress value={downloadProgress} className="h-2" />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Sync Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Auto Sync</div>
                    <div className="text-sm text-gray-600">Sync when online</div>
                  </div>
                  <Switch 
                    checked={settings.autoSync}
                    onCheckedChange={(checked) => saveSettings({...settings, autoSync: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pending Items</span>
                    <span>{offlineStats.pendingSync}</span>
                  </div>
                  {offlineStats.pendingSync > 0 && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      {offlineStats.pendingSync} items waiting to sync
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleSync}
                  disabled={isSyncing || !isOnline}
                  variant={offlineStats.pendingSync > 0 ? "default" : "outline"}
                  className="w-full"
                >
                  {isSyncing ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Syncing... {syncProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>

                {isSyncing && (
                  <Progress value={syncProgress} className="h-2" />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Visual Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Size: {settings.fontSize}px</label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => saveSettings({...settings, fontSize: value})}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">High Contrast</div>
                    <div className="text-sm text-gray-600">Enhanced visibility</div>
                  </div>
                  <Switch 
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => saveSettings({...settings, highContrast: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Reduce Motion</div>
                    <div className="text-sm text-gray-600">Minimize animations</div>
                  </div>
                  <Switch 
                    checked={settings.reduceMotion}
                    onCheckedChange={(checked) => saveSettings({...settings, reduceMotion: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5" />
                  Audio Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Screen Reader Support</div>
                    <div className="text-sm text-gray-600">Enhanced navigation</div>
                  </div>
                  <Switch 
                    checked={settings.screenReader}
                    onCheckedChange={(checked) => saveSettings({...settings, screenReader: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Voice Assistant</div>
                    <div className="text-sm text-gray-600">Voice commands</div>
                  </div>
                  <Switch 
                    checked={settings.voiceAssistant}
                    onCheckedChange={(checked) => saveSettings({...settings, voiceAssistant: checked})}
                  />
                </div>

                <Button 
                  onClick={() => multiLanguageService.speak("This is a test of the voice system")}
                  variant="outline" 
                  className="w-full"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Test Voice Output
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Performance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Low Bandwidth Mode</div>
                    <div className="text-sm text-gray-600">Reduce data usage</div>
                  </div>
                  <Switch 
                    checked={settings.lowBandwidth}
                    onCheckedChange={(checked) => saveSettings({...settings, lowBandwidth: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Offline Mode</div>
                    <div className="text-sm text-gray-600">Work without internet</div>
                  </div>
                  <Switch 
                    checked={settings.offlineMode}
                    onCheckedChange={(checked) => saveSettings({...settings, offlineMode: checked})}
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Optimization Active</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    Content is optimized for your device and connection
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Device Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">Fast</div>
                    <div className="text-sm text-green-700">Connection</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">Mobile</div>
                    <div className="text-sm text-blue-700">Optimized</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Cache Efficiency</span>
                    <span className="text-green-600">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Data Compression</span>
                    <span className="text-blue-600">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccessibilityHub;