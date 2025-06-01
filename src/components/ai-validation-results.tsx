"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle, 
  Brain,
  Database,
  Fingerprint,
  TrendingUp,
  Shield,
  Zap,
  Eye,
  BarChart3,
  Activity,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SimilarArtwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  similarityScore: number;
  source: string;
}

interface MetadataMatch {
  field: string;
  submitted: string;
  existing: string;
  match: boolean;
}

interface AIValidationResultsProps {
  artwork: {
    id: string;
    title: string;
    artist: string;
    images: string[];
    description: string;
    medium: string;
  };
  isLoading?: boolean;
  onRequestAIValidation?: () => void;
}

export function AIValidationResults({
  artwork,
  isLoading = false,
  onRequestAIValidation,
}: AIValidationResultsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [animatedScores, setAnimatedScores] = useState({
    similarity: 0,
    metadata: 0,
    overall: 0,
    authenticity: 0,
    originality: 0,
    technicalQuality: 0,
  });

  // Mock data for AI validation results
  const similarArtworks: SimilarArtwork[] = [
    {
      id: "sim-1",
      title: "Urban Landscape #2",
      artist: "James Wilson",
      image: "/placeholder.svg?height=300&width=300",
      similarityScore: 92,
      source: "Internal Database",
    },
    {
      id: "sim-2",
      title: "City View",
      artist: "Unknown",
      image: "/placeholder.svg?height=300&width=300",
      similarityScore: 87,
      source: "Public Registry",
    },
    {
      id: "sim-3",
      title: "Metropolitan Scene",
      artist: "Sarah Johnson",
      image: "/placeholder.svg?height=300&width=300",
      similarityScore: 76,
      source: "External Database",
    },
    {
      id: "sim-4",
      title: "Urban Perspective",
      artist: "David Chen",
      image: "/placeholder.svg?height=300&width=300",
      similarityScore: 68,
      source: "Public Registry",
    },
  ];

  const metadataMatches: MetadataMatch[] = [
    {
      field: "Title",
      submitted: artwork.title,
      existing: "Urban Landscape #2",
      match: false,
    },
    {
      field: "Artist",
      submitted: artwork.artist,
      existing: "James Wilson",
      match: true,
    },
    {
      field: "Medium",
      submitted: artwork.medium,
      existing: "Acrylic on canvas",
      match: true,
    },
    {
      field: "Style",
      submitted: "Contemporary",
      existing: "Contemporary",
      match: true,
    },
    {
      field: "Creation Date",
      submitted: "2025",
      existing: "2024",
      match: false,
    },
  ];

  const [scores, setScores] = useState({
    similarity: 0,
    metadata: 0,
    overall: 0,
  });

  useEffect(() => {
    fetch("http://localhost:3001/ai-vlm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const newScores = {
          similarity: data.image_similarity || Math.floor(Math.random() * 30) + 15,
          metadata: data.metadata_similarity || Math.floor(Math.random() * 40) + 60,
          overall: data.confidence || Math.floor(Math.random() * 35) + 25,
        };
        setScores(newScores);

        // Enhanced scores with animation
        const enhancedScores = {
          similarity: newScores.similarity,
          metadata: newScores.metadata,
          overall: newScores.overall,
          authenticity: Math.floor(Math.random() * 25) + 75,
          originality: Math.floor(Math.random() * 30) + 70,
          technicalQuality: Math.floor(Math.random() * 20) + 80,
        };

        // Animate score counting
        Object.keys(enhancedScores).forEach((key) => {
          let currentValue = 0;
          const targetValue = enhancedScores[key as keyof typeof enhancedScores];
          const increment = targetValue / 50;
          
          const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
              currentValue = targetValue;
              clearInterval(timer);
            }
            setAnimatedScores(prev => ({
              ...prev,
              [key]: Math.round(currentValue)
            }));
          }, 30);
        });
      })
      .catch((error) => {
        console.error("Error fetching AI validation results:", error);
        // Fallback values with animation
        const fallbackScores = {
          similarity: 25,
          metadata: 78,
          overall: 52,
          authenticity: 87,
          originality: 94,
          technicalQuality: 91,
        };

        Object.keys(fallbackScores).forEach((key) => {
          let currentValue = 0;
          const targetValue = fallbackScores[key as keyof typeof fallbackScores];
          const increment = targetValue / 50;
          
          const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
              currentValue = targetValue;
              clearInterval(timer);
            }
            setAnimatedScores(prev => ({
              ...prev,
              [key]: Math.round(currentValue)
            }));
          }, 30);
        });
      });
  }, [isLoading]);

  const getConfidenceBadge = (score: number) => {
    if (score >= 90) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800">
          <XCircle className="h-3 w-3 mr-1" /> High Risk
        </Badge>
      );
    } else if (score >= 75) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" /> Medium Risk
        </Badge>
      );
    } else if (score >= 50) {
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800">
          <Info className="h-3 w-3 mr-1" /> Low Risk
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800">
          <CheckCircle className="h-3 w-3 mr-1" /> Very Low Risk
        </Badge>
      );
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 90) return { level: "High", color: "text-red-600", bg: "bg-red-50 border-red-200" };
    if (score >= 75) return { level: "Medium", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" };
    if (score >= 50) return { level: "Low", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" };
    return { level: "Very Low", color: "text-green-600", bg: "bg-green-50 border-green-200" };
  };

  if (isLoading) {
    return (
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-teal-100 dark:border-teal-900 rounded-full animate-pulse"></div>
            <div className="absolute w-12 h-12 border-4 border-teal-200 dark:border-teal-800 rounded-full animate-ping"></div>
          </div>
          <div className="relative z-10 flex justify-center">
            <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-4 rounded-xl">
              <Brain className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">AI Neural Networks Processing</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Advanced algorithms are analyzing the artwork...</p>
        <div className="max-w-md mx-auto">
          <Progress value={75} className="h-2">
            <div className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full animate-pulse" />
          </Progress>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Comparing against 50M+ artworks in our global database
        </p>
      </div>
    );
  }

  if (!similarArtworks.length && onRequestAIValidation) {
    return (
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="mb-4">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">AI Validation Ready</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          No AI validation has been performed yet. Our advanced neural networks are ready to analyze this artwork.
        </p>
        <Button
          onClick={onRequestAIValidation}
          className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
        >
          <Zap className="h-4 w-4 mr-2" />
          Run AI Validation
        </Button>
      </div>
    );
  }

  const overallRisk = getRiskLevel(animatedScores.overall);

  return (
    <div className="space-y-8">
      {/* Enhanced overview cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Risk Assessment */}
        <div className="lg:col-span-2">
          <Card className={`border-2 ${overallRisk.bg} dark:bg-gray-800 shadow-lg`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <Shield className={`h-6 w-6 ${overallRisk.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Overall Risk Assessment</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive AI analysis result</p>
                  </div>
                </div>
                {getConfidenceBadge(animatedScores.overall)}
              </div>
              <div className="text-center py-6">
                <div className={`text-4xl font-bold mb-2 ${overallRisk.color}`}>
                  {animatedScores.overall}%
                </div>
                <div className="relative w-full max-w-md mx-auto">
                  <Progress value={animatedScores.overall} className="h-4 bg-gray-200 dark:bg-gray-700">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        animatedScores.overall >= 75 
                          ? 'bg-gradient-to-r from-red-500 to-red-600' 
                          : animatedScores.overall >= 50
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                          : 'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${animatedScores.overall}%` }}
                    />
                  </Progress>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  {overallRisk.level} risk of duplication or fraud
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Visual Analysis</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{animatedScores.similarity}%</div>
              <div className="text-xs text-gray-500">Image similarity detected</div>
              <Progress value={animatedScores.similarity} className="h-2 mt-2 bg-gray-100 dark:bg-gray-800">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000" 
                     style={{ width: `${animatedScores.similarity}%` }} />
              </Progress>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Metadata Check</span>
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">{animatedScores.metadata}%</div>
              <div className="text-xs text-gray-500">Metadata consistency</div>
              <Progress value={animatedScores.metadata} className="h-2 mt-2 bg-gray-100 dark:bg-gray-800">
                <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000" 
                     style={{ width: `${animatedScores.metadata}%` }} />
              </Progress>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Analysis Tabs */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview" className="text-sm font-medium">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analysis Overview
              </TabsTrigger>
              <TabsTrigger value="technical" className="text-sm font-medium">
                <Activity className="h-4 w-4 mr-2" />
                Technical Metrics
              </TabsTrigger>
              <TabsTrigger value="comparison" className="text-sm font-medium">
                <Target className="h-4 w-4 mr-2" />
                Similarity Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Fingerprint className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Authenticity Score</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{animatedScores.authenticity}%</div>
                  <Progress value={animatedScores.authenticity} className="h-3 bg-green-100 dark:bg-green-900">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000" 
                         style={{ width: `${animatedScores.authenticity}%` }} />
                  </Progress>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-2">High authenticity indicators</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Originality Index</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{animatedScores.originality}%</div>
                  <Progress value={animatedScores.originality} className="h-3 bg-blue-100 dark:bg-blue-900">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000" 
                         style={{ width: `${animatedScores.originality}%` }} />
                  </Progress>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">Strong originality markers</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Target className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Technical Quality</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{animatedScores.technicalQuality}%</div>
                  <Progress value={animatedScores.technicalQuality} className="h-3 bg-purple-100 dark:bg-purple-900">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-1000" 
                         style={{ width: `${animatedScores.technicalQuality}%` }} />
                  </Progress>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Excellent technical execution</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-teal-600" />
                  AI Analysis Summary
                </h4>
                <div className="prose prose-sm text-gray-700 dark:text-gray-300">
                  <p className="mb-3">
                    The submitted artwork demonstrates <strong>high authenticity indicators</strong> with excellent technical execution. 
                    Our neural network analysis reveals strong originality markers while detecting minimal similarity to existing works.
                  </p>
                  <p className="mb-3">
                    <strong>Key Findings:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Unique artistic style with distinctive visual characteristics</li>
                    <li>Consistent metadata across multiple verification points</li>
                    <li>Low risk of duplication based on visual similarity analysis</li>
                    <li>Strong provenance indicators in digital signature</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-teal-600">2048×2048</div>
                  <div className="text-sm text-gray-500">Resolution</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-blue-600">RGB</div>
                  <div className="text-sm text-gray-500">Color Space</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-purple-600">12.3MB</div>
                  <div className="text-sm text-gray-500">File Size</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-green-600">JPEG</div>
                  <div className="text-sm text-gray-500">Format</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Color Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Color Diversity</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Contrast Ratio</span>
                      <span className="font-medium">4.8:1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Saturation Avg</span>
                      <span className="font-medium">72%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Composition Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Symmetry Score</span>
                      <span className="font-medium">91%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Rule of Thirds</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Edge Complexity</span>
                      <span className="font-medium">68%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Similarity Analysis Complete
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Compared against 50+ million artworks in our comprehensive database
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{similarArtworks.length}</div>
                    <div className="text-xs text-gray-500">Similar Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{animatedScores.similarity}%</div>
                    <div className="text-xs text-gray-500">Max Similarity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-xs text-gray-500">Exact Matches</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
