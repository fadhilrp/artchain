"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, Users, Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Validator, ValidationStatus } from "@/lib/types/validation";

// Mock data for validators
const mockValidators: Validator[] = [
  {
    id: "val-1",
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    decision: "approve",
    feedback: "Artwork meets all authenticity criteria.",
    timestamp: "2025-05-14T10:30:00Z",
    reputation: 95,
  },
  {
    id: "val-2",
    name: "Emily Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    decision: "approve",
    feedback: "Verified original artwork with unique style.",
    timestamp: "2025-05-14T11:15:00Z",
    reputation: 92,
  },
  {
    id: "val-3",
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    decision: "approve",
    feedback: "Authentic piece with consistent style.",
    timestamp: "2025-05-14T12:45:00Z",
    reputation: 88,
  },
  {
    id: "val-4",
    name: "Sarah Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    decision: "approve",
    feedback: "Original artwork with unique characteristics.",
    timestamp: "2025-05-14T14:20:00Z",
    reputation: 91,
  },
  {
    id: "val-5",
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    decision: "reject",
    feedback: "Found similar artwork in public database.",
    timestamp: "2025-05-14T15:10:00Z",
    reputation: 87,
  },
  {
    id: "val-6",
    name: "Jessica Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    decision: "approve",
    feedback: "Verified as original work.",
    timestamp: "2025-05-14T16:30:00Z",
    reputation: 94,
  },
  {
    id: "val-7",
    name: "Robert Taylor",
    avatar: "/placeholder.svg?height=40&width=40",
    decision: "approve",
    feedback: "Authentic artwork with consistent style.",
    timestamp: "2025-05-15T09:15:00Z",
    reputation: 89,
  },
  {
    id: "val-8",
    name: "Amanda Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    decision: "approve",
    feedback: "Original work with unique characteristics.",
    timestamp: "2025-05-15T10:45:00Z",
    reputation: 93,
  },
  {
    id: "val-9",
    name: "Thomas Anderson",
    avatar: "/placeholder.svg?height=40&width=40",
    decision: "approve",
    feedback: "Verified as authentic.",
    timestamp: "2025-05-15T11:30:00Z",
    reputation: 90,
  },
];

// Mock validation status
const mockValidationStatus: ValidationStatus = {
  required: 11,
  completed: 9,
  approved: 8,
  rejected: 1,
  status: "in_progress",
  validators: mockValidators,
  consensusReached: false,
};

interface ArtworkValidationStatusProps {
  artworkId: string;
  validationStatus?: ValidationStatus;
}

export function ArtworkValidationStatus({
  artworkId,
  validationStatus = mockValidationStatus,
}: ArtworkValidationStatusProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: ValidationStatus["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Unknown
          </Badge>
        );
    }
  };

  const getDecisionBadge = (decision: "approve" | "reject" | undefined) => {
    if (decision === "approve") {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    } else if (decision === "reject") {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-600" />
            <CardTitle>Validation Status</CardTitle>
          </div>
          {getStatusBadge(validationStatus.status)}
        </div>
        <CardDescription>
          Artwork verification requires consensus from at least{" "}
          {validationStatus.required} validators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="validators">
              <Users className="h-4 w-4 mr-2" />
              Validators
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Validation Progress: {validationStatus.completed} of{" "}
                    {validationStatus.required}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(
                      (validationStatus.completed / validationStatus.required) *
                        100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (validationStatus.completed / validationStatus.required) *
                    100
                  }
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {validationStatus.approved}
                  </div>
                  <div className="text-sm text-gray-500">Approvals</div>
                </div>
                <div className="border rounded-md p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {validationStatus.rejected}
                  </div>
                  <div className="text-sm text-gray-500">Rejections</div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">Validation Process</h4>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-1 mt-0.5">
                      <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>
                      Each artwork requires validation from at least{" "}
                      {validationStatus.required} independent validators.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span>
                      Validators review the artwork, metadata, and AI analysis
                      to make their decision.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-1 mt-0.5">
                      <Shield className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>
                      Consensus is reached when a majority of validators agree
                      on the artwork's authenticity.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="validators">
            <div className="space-y-4">
              {validationStatus.validators.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-gray-500">
                    No validators have reviewed this artwork yet.
                  </p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Validator
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Decision
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Reputation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {validationStatus.validators.map((validator) => (
                        <tr
                          key={validator.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={validator.avatar || "/placeholder.svg"}
                                  alt={validator.name}
                                />
                                <AvatarFallback>
                                  {validator.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {validator.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    {getDecisionBadge(validator.decision)}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{validator.feedback}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {validator.timestamp
                              ? formatDate(validator.timestamp)
                              : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Progress
                                value={validator.reputation}
                                className={`h-2 w-16 ${
                                  validator.reputation
                                    ? validator.reputation >= 90
                                      ? "bg-green-600"
                                      : validator.reputation >= 80
                                      ? "bg-blue-600"
                                      : "bg-yellow-600"
                                    : "bg-gray-200"
                                }`}
                              />
                              <span className="text-sm">
                                {validator.reputation}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {validationStatus.validators.length <
                validationStatus.required && (
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-md p-4">
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Waiting for more validators
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                        {validationStatus.required -
                          validationStatus.validators.length}{" "}
                        more validators need to review this artwork before
                        consensus can be reached.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
