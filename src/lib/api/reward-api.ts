/**
 * Mock API for the validator rewards system
 */

// Types for the reward system
export interface RewardTransaction {
  id: string
  date: string
  amount: number
  type: "verification" | "bonus"
  status: "pending" | "completed" | "failed"
  artworkId: string
  artworkTitle: string
  artworkArtist: string
  artworkImage: string
  note?: string
  transactionHash?: string
}

export interface RewardBalance {
  balance: number
  pendingRewards: number
  totalEarned: number
  weeklyEarnings: number
  monthlyEarnings: number
}

export interface RewardStats {
  dailyEarnings: { name: string; value: number }[]
  monthlyEarnings: { name: string; value: number }[]
  yearlyEarnings: { name: string; value: number }[]
  validationCount: number
  averageRewardPerValidation: number
}

export interface RewardHistoryParams {
  period?: "day" | "week" | "month" | "year" | "all"
  type?: "verification" | "bonus" | "all"
  status?: "pending" | "completed" | "failed" | "all"
  page?: number
  limit?: number
  sortOrder?: "asc" | "desc"
}

export interface RewardHistoryResponse {
  transactions: RewardTransaction[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface WithdrawalRequest {
  amount: number
  walletAddress: string
  network: "ethereum" | "polygon" | "solana" | "artchain"
}

export interface WithdrawalResponse {
  success: boolean
  message: string
  transactionId?: string
  transactionHash?: string
  fee?: number
  estimatedTimeMinutes?: number
}

// Mock implementation of the reward API
export const rewardApi = {
  /**
   * Get the current reward balance for a validator
   * @param validatorId The ID of the validator
   * @returns Promise with the reward balance
   */
  getRewardBalance: async (validatorId: string): Promise<RewardBalance> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          balance: 1250.75,
          pendingRewards: 45.25,
          totalEarned: 1875.5,
          weeklyEarnings: 125.5,
          monthlyEarnings: 450.75,
        })
      }, 300)
    })
  },

  /**
   * Get reward statistics for a validator
   * @param validatorId The ID of the validator
   * @returns Promise with the reward statistics
   */
  getRewardStats: async (validatorId: string): Promise<RewardStats> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate daily earnings for the past week
        const dailyEarnings = Array(7)
          .fill(0)
          .map((_, index) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - index))
            return {
              name: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              value: Math.random() * 30 + 10,
            }
          })

        // Generate monthly earnings for the past 6 months
        const monthlyEarnings = Array(6)
          .fill(0)
          .map((_, index) => {
            const date = new Date()
            date.setMonth(date.getMonth() - (5 - index))
            return {
              name: date.toLocaleDateString("en-US", { month: "short" }),
              value: Math.random() * 300 + 200,
            }
          })

        // Generate yearly earnings for the past 3 years
        const yearlyEarnings = Array(3)
          .fill(0)
          .map((_, index) => {
            const date = new Date()
            date.setFullYear(date.getFullYear() - (2 - index))
            return {
              name: date.getFullYear().toString(),
              value: Math.random() * 3000 + 1000,
            }
          })

        resolve({
          dailyEarnings,
          monthlyEarnings,
          yearlyEarnings,
          validationCount: 39,
          averageRewardPerValidation: 15.25,
        })
      }, 500)
    })
  },

  /**
   * Get reward transaction history for a validator
   * @param validatorId The ID of the validator
   * @param params Query parameters for filtering and pagination
   * @returns Promise with the reward transaction history
   */
  getRewardHistory: async (validatorId: string, params: RewardHistoryParams = {}): Promise<RewardHistoryResponse> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Default values
        const page = params.page || 1
        const limit = params.limit || 10
        const sortOrder = params.sortOrder || "desc"

        // Generate mock transactions
        const mockTransactions: RewardTransaction[] = Array(limit)
          .fill(0)
          .map((_, index) => {
            const id = `tx-${index + 1}`

            // Random date based on period filter
            let date = new Date()
            if (params.period === "day") {
              date = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
            } else if (params.period === "week") {
              date = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
            } else if (params.period === "month") {
              date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            } else if (params.period === "year") {
              date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
            } else {
              date = new Date(Date.now() - Math.random() * 365 * 2 * 24 * 60 * 60 * 1000)
            }

            // Random type based on filter
            const types: RewardTransaction["type"][] = ["verification", "bonus"]
            const type =
              params.type === "all" || !params.type ? types[Math.floor(Math.random() * types.length)] : params.type

            // Random status based on filter
            const statuses: RewardTransaction["status"][] = ["pending", "completed", "failed"]
            const status =
              params.status === "all" || !params.status
                ? statuses[Math.floor(Math.random() * statuses.length)]
                : params.status

            // Random amount based on type
            const amount = type === "verification" ? 10 + Math.random() * 10 : 20 + Math.random() * 30

            // Random artwork details
            const artworkId = `art-${100 + index}`
            const artists = [
              "James Wilson",
              "Maria Chen",
              "Alex Rodriguez",
              "Emma Johnson",
              "David Lee",
              "Sarah Miller",
            ]
            const artist = artists[Math.floor(Math.random() * artists.length)]

            return {
              id,
              date: date.toISOString(),
              amount,
              type,
              status,
              artworkId,
              artworkTitle: `Artwork Title ${artworkId}`,
              artworkArtist: artist,
              artworkImage: "/placeholder.svg?height=100&width=100",
              note: type === "bonus" ? "Quality verification bonus" : undefined,
              transactionHash:
                status === "completed"
                  ? `0x${Array(40)
                      .fill(0)
                      .map(() => Math.floor(Math.random() * 16).toString(16))
                      .join("")}`
                  : undefined,
            }
          })

        // Sort transactions by date
        mockTransactions.sort((a, b) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB
        })

        resolve({
          transactions: mockTransactions,
          total: 45, // Mock total count
          page,
          limit,
          totalPages: Math.ceil(45 / limit),
        })
      }, 800)
    })
  },

  /**
   * Get details of a specific reward transaction
   * @param transactionId The ID of the transaction
   * @returns Promise with the transaction details
   */
  getTransactionDetails: async (transactionId: string): Promise<RewardTransaction> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Random type
        const types: RewardTransaction["type"][] = ["verification", "bonus"]
        const type = types[Math.floor(Math.random() * types.length)]

        // Random status
        const statuses: RewardTransaction["status"][] = ["pending", "completed", "failed"]
        const status = statuses[Math.floor(Math.random() * statuses.length)]

        // Random amount based on type
        const amount = type === "verification" ? 10 + Math.random() * 10 : 20 + Math.random() * 30

        // Random artwork details
        const artworkId = `art-${Math.floor(Math.random() * 100) + 100}`
        const artists = ["James Wilson", "Maria Chen", "Alex Rodriguez", "Emma Johnson", "David Lee", "Sarah Miller"]
        const artist = artists[Math.floor(Math.random() * artists.length)]

        resolve({
          id: transactionId,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          amount,
          type,
          status,
          artworkId,
          artworkTitle: `Artwork Title ${artworkId}`,
          artworkArtist: artist,
          artworkImage: "/placeholder.svg?height=100&width=100",
          note: type === "bonus" ? "Quality verification bonus" : undefined,
          transactionHash:
            status === "completed"
              ? `0x${Array(40)
                  .fill(0)
                  .map(() => Math.floor(Math.random() * 16).toString(16))
                  .join("")}`
              : undefined,
        })
      }, 300)
    })
  },

  /**
   * Request a withdrawal of tokens
   * @param validatorId The ID of the validator
   * @param request The withdrawal request details
   * @returns Promise with the withdrawal response
   */
  requestWithdrawal: async (validatorId: string, request: WithdrawalRequest): Promise<WithdrawalResponse> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if amount is valid
        if (request.amount <= 0) {
          resolve({
            success: false,
            message: "Withdrawal amount must be greater than zero",
          })
          return
        }

        // Check if wallet address is valid (mock validation)
        if (!request.walletAddress || request.walletAddress.length < 10) {
          resolve({
            success: false,
            message: "Invalid wallet address",
          })
          return
        }

        // Calculate network fee based on network
        let fee = 0
        switch (request.network) {
          case "ethereum":
            fee = 0.05 * request.amount
            break
          case "polygon":
            fee = 0.02 * request.amount
            break
          case "solana":
            fee = 0.01 * request.amount
            break
          case "artchain":
            fee = 0
            break
        }

        // Estimate time based on network
        let estimatedTimeMinutes = 0
        switch (request.network) {
          case "ethereum":
            estimatedTimeMinutes = 15
            break
          case "polygon":
            estimatedTimeMinutes = 5
            break
          case "solana":
            estimatedTimeMinutes = 2
            break
          case "artchain":
            estimatedTimeMinutes = 1
            break
        }

        resolve({
          success: true,
          message: `Withdrawal of ${request.amount} ART tokens to ${request.network} network initiated`,
          transactionId: `withdraw-${Date.now().toString(36)}`,
          transactionHash: `0x${Array(40)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join("")}`,
          fee,
          estimatedTimeMinutes,
        })
      }, 1500)
    })
  },

  /**
   * Get withdrawal history for a validator
   * @param validatorId The ID of the validator
   * @returns Promise with the withdrawal history
   */
  getWithdrawalHistory: async (
    validatorId: string,
  ): Promise<{
    withdrawals: {
      id: string
      date: string
      amount: number
      fee: number
      network: string
      status: "pending" | "completed" | "failed"
      transactionHash?: string
      walletAddress: string
    }[]
  }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate mock withdrawals
        const mockWithdrawals = Array(5)
          .fill(0)
          .map((_, index) => {
            const networks = ["ethereum", "polygon", "solana", "artchain"]
            const network = networks[Math.floor(Math.random() * networks.length)]

            const statuses: ("pending" | "completed" | "failed")[] = ["pending", "completed", "failed"]
            const status = statuses[Math.floor(Math.random() * statuses.length)]

            const amount = 100 + Math.random() * 500

            // Calculate fee based on network
            let fee = 0
            switch (network) {
              case "ethereum":
                fee = 0.05 * amount
                break
              case "polygon":
                fee = 0.02 * amount
                break
              case "solana":
                fee = 0.01 * amount
                break
              case "artchain":
                fee = 0
                break
            }

            return {
              id: `withdraw-${index + 1}`,
              date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
              amount,
              fee,
              network,
              status,
              transactionHash:
                status === "completed"
                  ? `0x${Array(40)
                      .fill(0)
                      .map(() => Math.floor(Math.random() * 16).toString(16))
                      .join("")}`
                  : undefined,
              walletAddress: `0x${Array(40)
                .fill(0)
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join("")}`,
            }
          })

        resolve({
          withdrawals: mockWithdrawals,
        })
      }, 800)
    })
  },
}
