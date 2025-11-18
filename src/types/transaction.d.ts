export interface TransactionPayload {
    screenshotFile: string | File,
    quantity: number,
    serviceType: string,
    type: string
}


export interface TransactionData {
    id: string;
    quantity: number;
    revenue: number;
    serviceType: "KPay" | "WavePay";
    type: "IN" | "OUT";
    screenshotUrl: string;
    addedByUserId: string;
    createdAt: Date;
    updatedAt: Date;
    addedBy: {
        id: string;
        name: string;
        email: string;
    }
}

export interface TransactionStats {
    totalIn: number;
    totalOut: number;
    totalRevenue: number;
    totalTransaction: number;
    inOutRatio: number;
    serviceTypeBreakdown: [
        {
            serviceType: "KPay" | "WavePay";
            count: number;
            totalAmount: number;
            totalRevenue: number;
        }
    ];
    dailyAverages: {
        averageIn: number;
        averageOut: number;
        averageRevenue: number;
    };
    filers: {
        type: "IN" | "OUT";
        serviceType: "KPay" | "WavePay";
    }
}

export interface TranscationResponse {
    stats: TransactionStats;
    recentTransactions: TransactionData[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNext: boolean;
        hasPrev: boolean;
        limit: number;
    }
}

export interface SetRevenueRate {
    name: string;
    operator: "GT" | "LT" | "EQ" | "GTE" | "LTE" | "BETWEEN" | string;
    value: number;
    secondValue: number;
    percentage: number;
    serviceType: "KPay" | "WavePay";
    inOutType: "IN" | "OUT";
}

export interface RevenueRate {
    id: string;
    name: string;
    operator: "GT" | "LT" | "EQ" | "GTE" | "LTE" | "BETWEEN" ;
    value: number;
    secondValue: number;
    percentage: number;
    serviceType: "KPay" | "WavePay";
    inOutType: "IN" | "OUT";
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    createdBy: {
        id: string;
        name: string;
        email: string;
    }
}

export interface GetAllTransactionRate {
    count: number;
    serviceType: "KPay" | "WavePay" | "ALL";
    type: "IN" | "OUT" | "ALL";
    rules: RevenueRate[]
}
