import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Loader2, Download, Languages, AlertCircle, CheckCircle, Eye, EyeOff, Mail, Phone, Lock, User, LogOut, Shield } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Auth form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Main app states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [complexity, setComplexity] = useState('simple');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'hindi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'tamil', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'telugu', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'marathi', name: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'gujarati', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'bengali', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
    { code: 'kannada', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
    { code: 'malayalam', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
    { code: 'punjabi', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
    { code: 'odia', name: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳' },
    { code: 'assamese', name: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
    { code: 'urdu', name: 'اردو (Urdu)', flag: '🇮🇳' },
    { code: 'sanskrit', name: 'संस्कृत (Sanskrit)', flag: '🇮🇳' },
    { code: 'nepali', name: 'नेपाली (Nepali)', flag: '🇳🇵' },
    { code: 'sindhi', name: 'سنڌي (Sindhi)', flag: '🇮🇳' }
  ];

  const complexityLevels = [
    { value: 'simple', label: 'Simple', description: 'Elementary school level' },
    { value: 'moderate', label: 'Moderate', description: 'High school level' },
    { value: 'detailed', label: 'Detailed', description: 'College level with legal context' }
  ];

  // Check if user is already logged in on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('legalSimplifierUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('legalSimplifierUser');
      }
    }
  }, []);

  // Authentication functions
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'signup') {
        // Validation for signup
        if (!name.trim()) {
          throw new Error('Name is required');
        }
        if (loginType === 'email' && !email.includes('@')) {
          throw new Error('Please enter a valid email address');
        }
        if (loginType === 'phone' && phone.length < 10) {
          throw new Error('Please enter a valid phone number');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Simulate signup API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newUser: User = {
          id: Date.now().toString(),
          name: name.trim(),
          email: loginType === 'email' ? email : undefined,
          phone: loginType === 'phone' ? phone : undefined
        };

        // Save to localStorage (in real app, this would be saved to backend)
        localStorage.setItem('legalSimplifierUser', JSON.stringify(newUser));
        setUser(newUser);
        setIsAuthenticated(true);
      } else {
        // Login validation
        if (loginType === 'email' && !email.includes('@')) {
          throw new Error('Please enter a valid email address');
        }
        if (loginType === 'phone' && phone.length < 10) {
          throw new Error('Please enter a valid phone number');
        }
        if (!password) {
          throw new Error('Password is required');
        }

        // Simulate login API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock user data (in real app, this would come from backend)
        const userData: User = {
          id: '123',
          name: 'User',
          email: loginType === 'email' ? email : undefined,
          phone: loginType === 'phone' ? phone : undefined
        };

        localStorage.setItem('legalSimplifierUser', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (loginType === 'phone' && phone.length >= 10) {
      setIsAuthLoading(true);
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsOtpSent(true);
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('legalSimplifierUser');
    setUser(null);
    setIsAuthenticated(false);
    // Reset all form states
    setSelectedFile(null);
    setSimplifiedText('');
    setOriginalText('');
    setError('');
    setSuccess(false);
  };

  // Real translation function using Google Translate API (or similar)
  const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    if (targetLanguage === 'english') {
      return text; // No translation needed for English
    }

    try {
      // Using MyMemory Translation API (Free, no API key needed)
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${getLanguageCode(targetLanguage)}`);
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback: return English text with error message
      return `${text}\n\n[Translation to ${targetLanguage} failed. Showing in English.]`;
    }
  };

  // Map language names to language codes for translation APIs
  const getLanguageCode = (language: string): string => {
    const languageCodes: Record<string, string> = {
      'hindi': 'hi',
      'tamil': 'ta',
      'telugu': 'te',
      'marathi': 'mr',
      'gujarati': 'gu',
      'bengali': 'bn',
      'kannada': 'kn',
      'malayalam': 'ml',
      'punjabi': 'pa',
      'odia': 'or',
      'assamese': 'as',
      'urdu': 'ur',
      'sanskrit': 'sa',
      'nepali': 'ne',
      'sindhi': 'sd',
      'english': 'en'
    };
    return languageCodes[language] || 'en';
  };

  const simulateProcessing = async () => {
    setIsProcessing(true);
    setError('');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock original text (always in English)
    const mockOriginal = `WHEREAS, the Party of the First Part (hereinafter referred to as "Lessor") is the lawful owner of certain real property located at [Property Address], and WHEREAS, the Party of the Second Part (hereinafter referred to as "Lessee") desires to lease said property for residential purposes under the terms and conditions hereinafter set forth; NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows: 1. LEASE TERM: The lease shall commence on [Start Date] and terminate on [End Date], unless sooner terminated in accordance with the provisions hereof...`;
    
    // Generate simplified English content based on complexity level
    let englishSimplified = '';
    switch (complexity) {
      case 'simple':
        englishSimplified = `This is a rental agreement between a landlord (the person who owns the property) and a tenant (the person who will rent it). The main points are:

• The property is located at [Property Address]
• The rental period starts on [Start Date] and ends on [End Date] 
• The tenant agrees to pay rent and follow the rules
• The landlord agrees to provide a safe, clean place to live

This document explains the rights and responsibilities of both parties in simple terms.`;
        break;
      case 'moderate':
        englishSimplified = `This lease agreement establishes a legal relationship between the property owner (Lessor/Landlord) and the renter (Lessee/Tenant). Key elements include:

• Property Details: The rental property is located at [Property Address]
• Lease Duration: The agreement runs from [Start Date] to [End Date]
• Payment Terms: Monthly rent amount, due dates, and late fees
• Tenant Responsibilities: Maintaining the property, following building rules
• Landlord Obligations: Property maintenance, repairs, and habitability standards

This contract is legally binding and protects both parties' interests during the rental period.`;
        break;
      case 'detailed':
        englishSimplified = `This residential lease agreement creates a landlord-tenant relationship governed by state and local housing laws. The document contains several key legal provisions:

• Parties: Establishes the legal identities of the Lessor (property owner) and Lessee (tenant)
• Property Description: Legally describes the rental premises at [Property Address]
• Term and Conditions: Specifies lease duration, renewal options, and termination procedures
• Financial Obligations: Details rent amount, security deposits, utilities, and fee structures
• Legal Rights and Duties: Outlines tenant rights (quiet enjoyment, habitability) and landlord obligations (maintenance, repairs)
• Breach and Remedies: Explains consequences of lease violations and legal remedies available

This agreement must comply with local rent control laws, fair housing regulations, and tenant protection statutes.`;
        break;
      default:
        englishSimplified = mockOriginal;
    }
    
    try {
      // Translate the simplified text to the selected language
      const translatedText = await translateText(englishSimplified, selectedLanguage);
      
      setOriginalText(mockOriginal);
      setSimplifiedText(translatedText);
      setSuccess(true);
    } catch (error) {
      setError('Failed to translate document. Please try again.');
      console.error('Translation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
        setError('');
        setSuccess(false);
      } else {
        setError('Please select a PDF file only.');
        setSelectedFile(null);
      }
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
      setSelectedFile(file);
      setError('');
      setSuccess(false);
    } else {
      setError('Please drop a PDF file only.');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }
    
    await simulateProcessing();
  };

  const downloadSimplified = () => {
    const element = document.createElement('a');
    const file = new Blob([simplifiedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `simplified_${selectedFile?.name?.replace('.pdf', '.txt') || 'document.txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // If not authenticated, show login/signup page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="bg-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Legal Document Simplifier</h1>
              <p className="text-blue-100">Making legal documents accessible to everyone</p>
            </div>

            {/* Auth Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMode === 'login'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMode === 'signup'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Login Type Toggle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {authMode === 'login' ? 'Login with' : 'Sign up with'}
                </label>
                <div className="flex bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => setLoginType('email')}
                    className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      loginType === 'email'
                        ? 'bg-white text-blue-600 shadow-sm border'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </button>
                  <button
                    onClick={() => setLoginType('phone')}
                    className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      loginType === 'phone'
                        ? 'bg-white text-blue-600 shadow-sm border'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </button>
                </div>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                )}

                {loginType === 'email' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+91 9876543210"
                        required
                      />
                      {!isOtpSent && phone.length >= 10 && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                          disabled={isAuthLoading}
                        >
                          Send OTP
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {loginType === 'phone' && isOtpSent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter OTP
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        required
                      />
                    </div>
                    <p className="text-xs text-green-600 mt-1">OTP sent successfully!</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                  </div>
                )}

                {authError && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{authError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isAuthLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{authMode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                    </>
                  ) : (
                    <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  )}
                </button>
              </form>

              {authMode === 'login' && (
                <div className="text-center mt-4">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="mt-8 text-center">
              <p className="text-blue-100 text-sm mb-4">Why choose Legal Document Simplifier?</p>
              <div className="grid grid-cols-1 gap-2 text-xs text-blue-100">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Support for 15+ Indian Languages</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>AI-Powered Legal Document Analysis</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Multiple Complexity Levels</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main application (shown after authentication)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Legal Document Simplifier</h1>
                <p className="text-sm text-gray-600">Making legal documents accessible to everyone</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI Powered</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span>Welcome, {user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded-md"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Upload and Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>
                
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    selectedFile 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {selectedFile ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                      <p className="text-sm font-medium text-green-700">{selectedFile.name}</p>
                      <p className="text-xs text-green-600">Ready to process</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="text-sm font-medium text-gray-700">Drop PDF here or click to browse</p>
                      <p className="text-xs text-gray-500">Supports: Legal contracts, agreements, policies</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Output Language</h3>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Complexity Level */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Simplification Level</h3>
                <div className="space-y-2">
                  {complexityLevels.map((level) => (
                    <label key={level.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="complexity"
                        value={level.value}
                        checked={complexity === level.value}
                        onChange={(e) => setComplexity(e.target.value)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{level.label}</p>
                        <p className="text-xs text-gray-600">{level.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Process Button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedFile || isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Languages className="h-5 w-5" />
                    <span>Simplify Document</span>
                  </>
                )}
              </button>

              {/* Error/Success Messages */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm text-green-700">Document simplified successfully!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {!simplifiedText && !isProcessing ? (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Processed Yet</h3>
                  <p className="text-gray-600">Upload a PDF and click "Simplify Document" to get started</p>
                </div>
              ) : isProcessing ? (
                <div className="text-center py-16">
                  <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Your Document</h3>
                  <p className="text-gray-600">Our AI is analyzing and simplifying your legal document...</p>
                  <div className="mt-6 max-w-md mx-auto">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Results Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Simplified Document</h2>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setShowOriginal(!showOriginal)}
                        className="flex items-center space-x-2 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        {showOriginal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>{showOriginal ? 'Hide' : 'Show'} Original</span>
                      </button>
                      <button
                        onClick={downloadSimplified}
                        className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  {/* Content Display */}
                  {showOriginal && (
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-medium text-gray-900 mb-2">Original Text:</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{originalText}</p>
                    </div>
                  )}

                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
                      <Languages className="h-5 w-5" />
                      <span>Simplified Version ({complexityLevels.find(l => l.value === complexity)?.label})</span>
                    </h4>
                    <div className="prose prose-blue max-w-none">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{simplifiedText}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">85%</p>
                      <p className="text-sm text-gray-600">Complexity Reduced</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{complexity === 'simple' ? '5th' : complexity === 'moderate' ? '10th' : '12th'}</p>
                      <p className="text-sm text-gray-600">Grade Reading Level</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">3 min</p>
                      <p className="text-sm text-gray-600">Estimated Reading Time</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Built for Hackathon 2025 • Making Legal Documents Accessible</p>
            <p className="text-sm">Supporting multiple languages and complexity levels for better understanding</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;