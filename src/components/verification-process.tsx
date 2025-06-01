"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Users,
  Brain,
  Scan,
  Database,
  Shield,
  BarChart3,
  Clock,
  Target,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AIValidationResults } from "@/components/ai-validation-results";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ValidationStatus, Validator } from "@/lib/types/validation";

interface VerificationProcessProps {
  artwork: any;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (
    artworkId: string,
    isApproved: boolean,
    feedback: string
  ) => void;
  totalSelected: number;
  currentIndex: number;
}

export function VerificationProcess({
  artwork,
  isOpen,
  onClose,
  onComplete,
  totalSelected,
  currentIndex,
}: VerificationProcessProps) {
  const [step, setStep] = useState<
    "analyzing" | "results" | "decision" | "success"
  >("analyzing");
  const [validationDecision, setValidationDecision] = useState<
    "approve" | "reject" | null
  >(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("artwork");
  const [analysisStage, setAnalysisStage] = useState<string>("Initializing");
  const [stageProgress, setStageProgress] = useState(0);

  // Enhanced analysis stages for sophisticated look
  const analysisStages = [
    { name: "Initializing", icon: Brain, description: "Preparing neural networks", duration: 1000 },
    { name: "Image Processing", icon: Scan, description: "Extracting visual features", duration: 2000 },
    { name: "Pattern Recognition", icon: Target, description: "Analyzing artistic patterns", duration: 1500 },
    { name: "Database Comparison", icon: Database, description: "Cross-referencing global databases", duration: 2500 },
    { name: "Metadata Analysis", icon: BarChart3, description: "Validating provenance data", duration: 1200 },
    { name: "Final Assessment", icon: Shield, description: "Generating confidence scores", duration: 800 },
  ];

  // Use actual artwork data if available, otherwise fallback to mock validation status
  const validationStatus = {
    required: artwork.requiredValidators || 2,
    completed: artwork.consensusCount || 0,
    approved: Math.floor((artwork.consensusCount || 0) * 0.7), // Approximate 70% approval rate
    rejected: Math.floor((artwork.consensusCount || 0) * 0.3), // Approximate 30% rejection rate
    status: artwork.validated ? "validated" : "in_progress",
    validators: Array(artwork.consensusCount || 0)
      .fill(null)
      .map((_, i) => ({
        id: `validator-${i + 1}`,
        name: `Validator ${i + 1}`,
        decision: Math.random() > 0.3 ? "approve" : "reject",
        feedback: `Feedback from validator ${i + 1}`,
        timestamp: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        reputation: 70 + Math.floor(Math.random() * 30),
      })),
    consensusReached: artwork.validated || false,
  } as ValidationStatus;

  useEffect(() => {
    // Enhanced AI analysis progress simulation
    if (step === "analyzing") {
      let currentStage = 0;
      let stageStartTime = Date.now();
      
      const runStage = () => {
        if (currentStage >= analysisStages.length) {
          setTimeout(() => setStep("results"), 500);
          return;
        }

        const stage = analysisStages[currentStage];
        setAnalysisStage(stage.name);
        
        const stageInterval = setInterval(() => {
          const elapsed = Date.now() - stageStartTime;
          const stageProgressValue = Math.min(100, (elapsed / stage.duration) * 100);
          setStageProgress(stageProgressValue);
          
          const overallProgress = ((currentStage + stageProgressValue / 100) / analysisStages.length) * 100;
          setAnalysisProgress(overallProgress);

          if (stageProgressValue >= 100) {
            clearInterval(stageInterval);
            currentStage++;
            stageStartTime = Date.now();
            setStageProgress(0);
            setTimeout(runStage, 200);
          }
        }, 50);
      };

      runStage();
    }
  }, [step]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSubmit = () => {
    if (!validationDecision) {
      alert("Please select whether to approve or reject this artwork");
      return;
    }

    if (feedback.trim() === "") {
      alert("Please provide feedback for the artist");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onComplete(artwork.id, validationDecision === "approve", feedback);
      setIsSubmitting(false);
      setValidationDecision(null);
      setFeedback("");
      setStep("success"); // Transition to success step
      setAnalysisProgress(0);
      setStageProgress(0);
      setAnalysisStage("Initializing");
    }, 1000);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getCurrentStageIcon = () => {
    const currentStageData = analysisStages.find(stage => stage.name === analysisStage);
    return currentStageData?.icon || Brain;
  };

  const getCurrentStageDescription = () => {
    const currentStageData = analysisStages.find(stage => stage.name === analysisStage);
    return currentStageData?.description || "Processing...";
  };

  const renderStepContent = () => {
    switch (step) {
      case "analyzing":
        const CurrentIcon = getCurrentStageIcon();
        return (
          <div className="py-16 text-center">
            {/* Enhanced neural network animation background */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-4 border-teal-100 dark:border-teal-900 rounded-full animate-pulse"></div>
                <div className="absolute w-24 h-24 border-4 border-teal-200 dark:border-teal-800 rounded-full animate-ping"></div>
                <div className="absolute w-16 h-16 border-4 border-teal-300 dark:border-teal-700 rounded-full animate-bounce"></div>
              </div>
              <div className="relative z-10 flex justify-center">
                <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-6 rounded-2xl shadow-2xl">
                  <CurrentIcon className="h-12 w-12 text-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sophisticated status display */}
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Advanced AI Verification in Progress
                </h3>
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {analysisStage}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {getCurrentStageDescription()}
                </p>
              </div>

              {/* Enhanced progress indicators */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                    <span className="font-semibold">{Math.round(analysisProgress)}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-3 bg-gray-200 dark:bg-gray-700">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-300 ease-out" 
                         style={{ width: `${analysisProgress}%` }} />
                  </Progress>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Current Stage</span>
                    <span className="font-semibold">{Math.round(stageProgress)}%</span>
                  </div>
                  <Progress value={stageProgress} className="h-2 bg-gray-100 dark:bg-gray-800">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-100" 
                         style={{ width: `${stageProgress}%` }} />
                  </Progress>
                </div>
              </div>

              {/* Analysis stages visualization */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">
                {analysisStages.map((stage, index) => {
                  const isActive = stage.name === analysisStage;
                  const isCompleted = analysisStages.findIndex(s => s.name === analysisStage) > index;
                  const StageIcon = stage.icon;
                  
                  return (
                    <div key={stage.name} className="text-center">
                      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isActive 
                          ? 'bg-teal-500 text-white animate-pulse' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}>
                        <StageIcon className="h-5 w-5" />
                      </div>
                      <div className={`text-xs font-medium ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500'}`}>
                        {stage.name.replace(' ', '\n')}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Real-time analysis stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{Math.floor(Math.random() * 50000) + 10000}</div>
                  <div className="text-xs text-gray-500">Features Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.floor(Math.random() * 100) + 50}M</div>
                  <div className="text-xs text-gray-500">Database Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.floor(Math.random() * 10) + 5}</div>
                  <div className="text-xs text-gray-500">AI Models</div>
                </div>
              </div>

              <p className="text-sm text-gray-500 flex items-center justify-center gap-2 mt-6">
                <Clock className="h-4 w-4" />
                Estimated completion: {Math.ceil((100 - analysisProgress) / 10)} seconds
              </p>
            </div>
          </div>
        );

      case "results":
        return (
          <div className="py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="artwork" className="text-sm font-medium">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Artwork Details
                </TabsTrigger>
                <TabsTrigger value="ai-results" className="text-sm font-medium">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="artwork">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                      <img
                        src={artwork?.images?.[0] || "/placeholder.svg"}
                        alt={artwork?.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Enhanced artwork metadata */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl space-y-4">
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-teal-600" />
                        Authentication Status
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Blockchain Hash</span>
                          <Badge variant="outline" className="font-mono text-xs">
                            {artwork.id.substring(0, 8)}...{artwork.id.substring(artwork.id.length - 8)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Validation Score</span>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-bold text-green-600">98.7%</div>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Level</span>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Low Risk
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{artwork?.title}</h3>
                      <p className="text-teal-600 dark:text-teal-400 font-medium mb-4">
                        by {artwork?.artist}
                      </p>

                      <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                        <div>
                          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Medium</p>
                          <p className="text-gray-600 dark:text-gray-400">{artwork?.medium}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Submitted</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {formatDate(artwork?.dateSubmitted)}
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {artwork?.description}
                        </p>
                      </div>

                      {artwork?.additionalInfo && (
                        <div className="mb-6">
                          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Additional Information</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {artwork.additionalInfo}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Enhanced validation progress */}
                    <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950 p-6 rounded-xl border border-teal-200 dark:border-teal-800">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                          <Users className="h-5 w-5 text-teal-600" />
                          Validation Progress
                        </h4>
                        <span className="text-sm font-bold bg-white dark:bg-gray-800 px-3 py-1 rounded-full border">
                          {validationStatus.completed} of {validationStatus.required} validators
                        </span>
                      </div>
                      <Progress
                        value={(validationStatus.completed / validationStatus.required) * 100}
                        className="h-3 mb-4"
                      />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">{validationStatus.approved} Approved</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">{validationStatus.rejected} Rejected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-results">
                <AIValidationResults artwork={artwork} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end mt-8">
              <Button
                onClick={() => setStep("decision")}
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg transition-all duration-200"
              >
                Continue to Decision
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "decision":
        return (
          <div className="py-6 space-y-8">
            {/* Enhanced validation progress display */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-teal-600" />
                  Network Consensus Status
                </h4>
                <span className="text-sm font-bold bg-white dark:bg-gray-800 px-4 py-2 rounded-full border shadow-sm">
                  {validationStatus.completed} of {validationStatus.required} validators
                </span>
              </div>
              <Progress
                value={(validationStatus.completed / validationStatus.required) * 100}
                className="h-4 mb-4"
              />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-lg font-bold text-green-600">{validationStatus.approved}</div>
                  <div className="text-gray-500">Approved</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-lg font-bold text-red-600">{validationStatus.rejected}</div>
                  <div className="text-gray-500">Rejected</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-lg font-bold text-gray-600">{validationStatus.required - validationStatus.completed}</div>
                  <div className="text-gray-500">Pending</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  This artwork requires validation from {validationStatus.required} validators before a final decision is made
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-teal-600" />
                Your Validation Decision
              </h3>

              <RadioGroup
                value={validationDecision || ""}
                onValueChange={(value) =>
                  setValidationDecision(value as "approve" | "reject")
                }
                className="space-y-4"
              >
                <div className="flex items-center space-x-4 rounded-xl border-2 p-4 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-200 hover:border-green-300 dark:hover:border-green-700">
                  <RadioGroupItem value="approve" id="approve" className="border-2" />
                  <Label
                    htmlFor="approve"
                    className="flex items-center cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">Approve Artwork</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Artwork meets authenticity and quality criteria
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-4 rounded-xl border-2 p-4 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 hover:border-red-300 dark:hover:border-red-700">
                  <RadioGroupItem value="reject" id="reject" className="border-2" />
                  <Label
                    htmlFor="reject"
                    className="flex items-center cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">Reject Artwork</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Artwork does not meet authenticity or quality criteria
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="space-y-3 mb-4">
                <Label htmlFor="feedback" className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Detailed Feedback for Artist
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Provide constructive feedback that will help the artist understand your decision.
                </p>
              </div>
              <Textarea
                id="feedback"
                placeholder="Please provide detailed reasoning for your decision. Consider aspects like originality, artistic merit, technical quality, and authenticity..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[140px] text-sm leading-relaxed border-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  This feedback will be visible to the artist and will contribute to the artwork's permanent record
                </p>
              </div>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Verification Successful!</h3>
            <p className="text-gray-500 mb-6">
              You have successfully verified the artwork and earned{" "}
              <strong>10 VLT</strong> rewards.
            </p>
            <Button onClick={onClose} className="bg-teal-600 hover:bg-teal-700">
              Close
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Advanced Artwork Verification
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {step === "analyzing"
              ? "Our AI systems are conducting comprehensive analysis"
              : step === "results"
              ? "Review comprehensive analysis results and artwork details"
              : "Make your professional validation decision"}
            {totalSelected > 1 && (
              <span className="ml-2 text-teal-600 dark:text-teal-400 font-medium">
                ({currentIndex} of {totalSelected})
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {renderStepContent()}

        <DialogFooter className="pt-6 border-t border-gray-200 dark:border-gray-700">
          {step === "decision" ? (
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                onClick={() => setStep("results")}
                className="px-6 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Back to Results
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !validationDecision || feedback.trim() === "" || isSubmitting
                }
                className={`px-8 py-2 font-medium shadow-lg transition-all duration-200 ${
                  validationDecision === "approve"
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    : validationDecision === "reject"
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Decision"
                )}
              </Button>
            </div>
          ) : step === "results" ? (
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-6 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
