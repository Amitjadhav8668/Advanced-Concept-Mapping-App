import React, { useState } from 'react';
import { 
  Brain, 
  Mail, 
  Lock, 
  Github, 
  Chrome,
  Eye,
  EyeOff,
  Network,
  Sparkles,
  Users,
  Lightbulb
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useTheme } from './theme-provider';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login/signup
    const userData = {
      id: '1',
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.email}`,
    };
    
    onLogin(userData);
  };

  const handleSocialLogin = (provider: string) => {
    // Mock social login
    const userData = {
      id: '1',
      name: `User from ${provider}`,
      email: `user@${provider.toLowerCase()}.com`,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${provider}`,
    };
    
    onLogin(userData);
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Smart suggestions and auto-layout optimization',
    },
    {
      icon: Network,
      title: 'Interactive Canvas',
      description: 'Drag, drop, and connect concepts effortlessly',
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time',
    },
    {
      icon: Lightbulb,
      title: 'Visual Learning',
      description: 'Transform complex ideas into clear visual maps',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left Panel - Features */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-600 rounded-xl text-white">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ConceptMap Pro
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced visual thinking platform
              </p>
            </div>
          </div>

          <div className="grid gap-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Join 50,000+ users creating amazing concept maps</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">ConceptMap</span>
            </div>
            <CardTitle className="text-2xl">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Start creating amazing concept maps today' 
                : 'Sign in to access your workspace'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={isSignUp}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('Google')}
                className="w-full"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('GitHub')}
                className="w-full"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-blue-600 hover:underline"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
              
              {!isSignUp && (
                <div>
                  <button className="text-sm text-gray-500 hover:underline">
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 pt-4">
              <Badge variant="secondary" className="text-xs">
                Free Plan
              </Badge>
              <span className="text-xs text-gray-500">
                No credit card required
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}