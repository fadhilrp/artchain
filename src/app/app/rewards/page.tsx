"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Coins,
  ArrowUpRight,
  Filter,
  Download,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RewardTransactionDetails } from "@/components/reward-transaction-details";
import { BarChart, LineChart } from "@/components/ui/charts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for rewards
const mockRewardsData = {
  balance: 1250.75,
  pendingRewards: 45.25,
  totalEarned: 1875.5,
  weeklyEarnings: 125.5,
  transactions: [
    {
      id: "tx-1",
      date: "2025-05-15T14:30:00Z",
      amount: 15.5,
      type: "verification",
      status: "completed",
      artworkId: "art-101",
      artworkTitle: "Urban Landscape #3",
      artworkArtist: "James Wilson",
      artworkImage: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "tx-2",
      date: "2025-05-14T11:45:00Z",
      amount: 12.25,
      type: "verification",
      status: "completed",
      artworkId: "art-102",
      artworkTitle: "Serenity in Blue",
      artworkArtist: "Maria Chen",
      artworkImage: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "tx-3",
      date: "2025-05-13T16:20:00Z",
      amount: 18.75,
      type: "bonus",
      status: "completed",
      artworkId: "art-103",
      artworkTitle: "Digital Dystopia",
      artworkArtist: "Alex Rodriguez",
      artworkImage: "/placeholder.svg?height=100&width=100",
      note: "Quality verification bonus",
    },
    {
      id: "tx-4",
      date: "2025-05-12T09:15:00Z",
      amount: 14.0,
      type: "verification",
      status: "completed",
      artworkId: "art-104",
      artworkTitle: "Forest Whispers",
      artworkArtist: "Emma Johnson",
      artworkImage: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "tx-5",
      date: "2025-05-11T13:40:00Z",
      amount: 16.25,
      type: "verification",
      status: "completed",
      artworkId: "art-105",
      artworkTitle: "Geometric Harmony",
      artworkArtist: "David Lee",
      artworkImage: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "tx-6",
      date: "2025-05-10T15:10:00Z",
      amount: 45.25,
      type: "verification",
      status: "pending",
      artworkId: "art-106",
      artworkTitle: "Autumn Reflections",
      artworkArtist: "Sarah Miller",
      artworkImage: "/placeholder.svg?height=100&width=100",
      note: "Pending blockchain confirmation",
    },
  ],
  dailyEarnings: [
    { name: "May 10", value: 45.25 },
    { name: "May 11", value: 16.25 },
    { name: "May 12", value: 14.0 },
    { name: "May 13", value: 18.75 },
    { name: "May 14", value: 12.25 },
    { name: "May 15", value: 15.5 },
    { name: "May 16", value: 0 },
  ],
  monthlyEarnings: [
    { name: "Jan", value: 320.5 },
    { name: "Feb", value: 285.75 },
    { name: "Mar", value: 350.25 },
    { name: "Apr", value: 410.5 },
    { name: "May", value: 450.75 },
  ],
};

export default function RewardsPage() {
  const router = useRouter();
  const [rewardsData, setRewardsData] = useState(mockRewardsData);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTransaction, setSelectedTransaction] = useState<
    (typeof mockRewardsData.transactions)[0] | null
  >(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [filteredTransactions, setFilteredTransactions] = useState(
    rewardsData.transactions
  );

  useEffect(() => {
    // Filter transactions based on selected filters
    let filtered = [...rewardsData.transactions];

    // Apply period filter
    if (filterPeriod === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter((tx) => new Date(tx.date) >= oneWeekAgo);
    } else if (filterPeriod === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filtered = filtered.filter((tx) => new Date(tx.date) >= oneMonthAgo);
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((tx) => tx.type === filterType);
    }

    setFilteredTransactions(filtered);
  }, [rewardsData.transactions, filterPeriod, filterType]);

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

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ART`;
  };

  const handleViewDetails = (
    transaction: (typeof mockRewardsData.transactions)[0]
  ) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-2 flex items-center text-sm"
            onClick={() => router.push("/app")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Validator Rewards</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export History
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Balance
                </CardTitle>
                <Coins className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(rewardsData.balance)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Badge variant="outline" className="text-xs font-normal">
                    + {formatCurrency(rewardsData.pendingRewards)} pending
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Weekly Earnings
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(rewardsData.weeklyEarnings)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Last 7 days
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Earned
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(rewardsData.totalEarned)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  All time
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Earnings</CardTitle>
                <CardDescription>
                  Your earnings over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={rewardsData.dailyEarnings}
                  index="name"
                  categories={["value"]}
                  colors={["teal"]}
                  valueFormatter={(value) => `${value} ART`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Earnings</CardTitle>
                <CardDescription>
                  Your earnings trend over the past months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={rewardsData.monthlyEarnings}
                  index="name"
                  categories={["value"]}
                  colors={["teal"]}
                  valueFormatter={(value) => `${value} ART`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your most recent reward transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Artwork
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rewardsData.transactions.slice(0, 5).map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <td className="px-4 py-3 text-sm">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  transaction.artworkImage || "/placeholder.svg"
                                }
                                alt={transaction.artworkTitle}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="truncate max-w-[150px]">
                              <p className="text-sm font-medium truncate">
                                {transaction.artworkTitle}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                by {transaction.artworkArtist}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              transaction.type === "bonus"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                            }
                          >
                            {transaction.type === "verification"
                              ? "Verification"
                              : "Bonus"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                            }
                          >
                            {transaction.status === "completed"
                              ? "Completed"
                              : "Pending"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewDetails(transaction)}
                          >
                            <Info className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("history")}
                >
                  View All Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Complete history of your reward transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 flex gap-2">
                  <div className="w-40">
                    <Select
                      value={filterPeriod}
                      onValueChange={setFilterPeriod}
                    >
                      <SelectTrigger>
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Time Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="month">Last Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-40">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="verification">
                          Verification
                        </SelectItem>
                        <SelectItem value="bonus">Bonus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Artwork
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <td className="px-4 py-3 text-sm">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  transaction.artworkImage || "/placeholder.svg"
                                }
                                alt={transaction.artworkTitle}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="truncate max-w-[150px]">
                              <p className="text-sm font-medium truncate">
                                {transaction.artworkTitle}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                by {transaction.artworkArtist}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              transaction.type === "bonus"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                            }
                          >
                            {transaction.type === "verification"
                              ? "Verification"
                              : "Bonus"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                            }
                          >
                            {transaction.status === "completed"
                              ? "Completed"
                              : "Pending"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleViewDetails(transaction)}
                                >
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">View details</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View transaction details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedTransaction && (
        <RewardTransactionDetails
          transaction={selectedTransaction}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
}
