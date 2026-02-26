import { useState } from 'react';
import { 
  ArrowLeft,
  Palette,
  Grid,
  Save,
  Zap,
  Monitor,
  Moon,
  Sun,
  Settings,
  User,
  Download,
  Upload,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { useTheme } from './theme-provider';

interface SettingsPageProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
  onClose: () => void;
}

const backgroundColors = [
  { name: 'White', value: '#ffffff' },
  { name: 'Light Gray', value: '#f8f9fa' },
  { name: 'Blue Gray', value: '#f1f5f9' },
  { name: 'Warm Gray', value: '#fafaf9' },
  { name: 'Cool Gray', value: '#f9fafb' },
  { name: 'Light Blue', value: '#eff6ff' },
  { name: 'Light Green', value: '#f0fdf4' },
  { name: 'Light Purple', value: '#faf5ff' },
  { name: 'Light Yellow', value: '#fefce8' },
  { name: 'Light Pink', value: '#fdf2f8' },
  { name: 'Dark Gray', value: '#1f2937' },
  { name: 'Dark Blue', value: '#1e293b' },
];

const backgroundPatterns = [
  { name: 'Dots', value: 'dots' },
  { name: 'Lines', value: 'lines' },
  { name: 'Cross', value: 'cross' },
  { name: 'None', value: 'none' },
];

export function SettingsPage({ settings, onSettingsChange, onClose }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(tempSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      backgroundColor: '#ffffff',
      backgroundPattern: 'dots',
      theme: 'system',
      autoSave: true,
      snapToGrid: false,
      showMinimap: false,
    };
    setTempSettings(defaultSettings);
  };

  const updateSetting = (key: string, value: any) => {
    setTempSettings({ ...tempSettings, [key]: value });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workspace
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Settings & Preferences</h1>
              <p className="text-sm text-muted-foreground">
                Customize your concept mapping experience
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="canvas">Canvas</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme & Colors
                </CardTitle>
                <CardDescription>
                  Customize the visual appearance of your workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label className="text-base font-medium">Theme Mode</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {[
                        { name: 'Light', value: 'light', icon: Sun },
                        { name: 'Dark', value: 'dark', icon: Moon },
                        { name: 'System', value: 'system', icon: Monitor },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={theme === option.value ? 'default' : 'outline'}
                          onClick={() => setTheme(option.value as any)}
                          className="flex flex-col items-center gap-2 h-20"
                        >
                          <option.icon className="w-5 h-5" />
                          <span className="text-sm">{option.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">Canvas Background Color</Label>
                    <div className="grid grid-cols-6 gap-3 mt-3">
                      {backgroundColors.map((color) => (
                        <Button
                          key={color.value}
                          variant="outline"
                          className={`h-12 p-0 relative ${
                            tempSettings.backgroundColor === color.value 
                              ? 'ring-2 ring-blue-500' 
                              : ''
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => updateSetting('backgroundColor', color.value)}
                        >
                          <span className="sr-only">{color.name}</span>
                          {tempSettings.backgroundColor === color.value && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            </div>
                          )}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Current: {backgroundColors.find(c => c.value === tempSettings.backgroundColor)?.name}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">Background Pattern</Label>
                    <Select
                      value={tempSettings.backgroundPattern}
                      onValueChange={(value) => updateSetting('backgroundPattern', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundPatterns.map((pattern) => (
                          <SelectItem key={pattern.value} value={pattern.value}>
                            {pattern.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Canvas Tab */}
          <TabsContent value="canvas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid className="w-5 h-5" />
                  Canvas Settings
                </CardTitle>
                <CardDescription>
                  Configure how the canvas behaves and displays
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Snap to Grid</Label>
                    <p className="text-sm text-muted-foreground">
                      Align nodes and elements to an invisible grid
                    </p>
                  </div>
                  <Switch
                    checked={tempSettings.snapToGrid}
                    onCheckedChange={(checked) => updateSetting('snapToGrid', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Show Minimap</Label>
                    <p className="text-sm text-muted-foreground">
                      Display a minimap for easier navigation
                    </p>
                  </div>
                  <Switch
                    checked={tempSettings.showMinimap}
                    onCheckedChange={(checked) => updateSetting('showMinimap', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">Zoom Sensitivity</Label>
                  <Slider
                    value={[tempSettings.zoomSensitivity || 1]}
                    onValueChange={([value]) => updateSetting('zoomSensitivity', value)}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Current: {(tempSettings.zoomSensitivity || 1).toFixed(1)}x
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">Animation Speed</Label>
                  <Slider
                    value={[tempSettings.animationSpeed || 1]}
                    onValueChange={([value]) => updateSetting('animationSpeed', value)}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Current: {(tempSettings.animationSpeed || 1).toFixed(1)}x
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Behavior Tab */}
          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Behavior & Interaction
                </CardTitle>
                <CardDescription>
                  Control how the application behaves and saves your work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Auto Save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save changes as you work
                    </p>
                  </div>
                  <Switch
                    checked={tempSettings.autoSave}
                    onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Smart Connections</Label>
                    <p className="text-sm text-muted-foreground">
                      AI suggests connection points when dragging
                    </p>
                  </div>
                  <Switch
                    checked={tempSettings.smartConnections || true}
                    onCheckedChange={(checked) => updateSetting('smartConnections', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Node Collision Detection</Label>
                    <p className="text-sm text-muted-foreground">
                      Prevent nodes from overlapping when moving
                    </p>
                  </div>
                  <Switch
                    checked={tempSettings.nodeCollision || false}
                    onCheckedChange={(checked) => updateSetting('nodeCollision', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">Auto Save Interval</Label>
                  <Select
                    value={String(tempSettings.autoSaveInterval || 30)}
                    onValueChange={(value) => updateSetting('autoSaveInterval', Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">Every 10 seconds</SelectItem>
                      <SelectItem value="30">Every 30 seconds</SelectItem>
                      <SelectItem value="60">Every 1 minute</SelectItem>
                      <SelectItem value="300">Every 5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account & Profile
                </CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                  <div>
                    <h3 className="font-medium">John Doe</h3>
                    <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                    <Badge variant="secondary" className="mt-1">Free Plan</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  About ConceptMap Pro
                </CardTitle>
                <CardDescription>
                  Information about the application and support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">ConceptMap Pro</h3>
                    <p className="text-muted-foreground">Version 2.1.0</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• AI-powered suggestions</li>
                        <li>• Real-time collaboration</li>
                        <li>• Advanced layouts</li>
                        <li>• Export capabilities</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Support</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Help documentation</li>
                        <li>• Video tutorials</li>
                        <li>• Community forum</li>
                        <li>• Email support</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm">
                    View Changelog
                  </Button>
                  <Button variant="outline" size="sm">
                    Report Issue
                  </Button>
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}