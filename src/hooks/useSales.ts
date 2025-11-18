import { useDashboardStatisticsQuery } from '@/services/DashboardService/dashboard.query';
import { FilterTypes, GetSaleApiResponse } from '@/types/pos';
import { getSalesStatCards } from '@/utils/statCardsConfig';
import { useEffect, useState } from 'react'
import { useExcelExport } from './exportToExcel';
import { useSaleQuery } from '@/services/saleServices/sale.query';
import { useNavigate, useSearch } from '@tanstack/react-router';

const useSales = () => {
    const navigate = useNavigate()
    const [openSaleItems, setOpenSaleItems] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [isExporting, setIsExporting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<GetSaleApiResponse | null>(null);

    const filterTypes : FilterTypes[] = [
        "Date",
        "Week",
        "Month"
    ]
    const [selectedFilterType, setSelectedFilterType] = useState("Date")

    useEffect(() => {
        navigate({
            to: ".",
            search: (prev) => ({
                ...prev,
                filterBy: selectedFilterType
            })
        })
    }, [selectedFilterType])

    const serviceType = useSearch({
        strict: false,
    }) as { service: string, type: string, startDate: string, endDate: string , filterBy: string}

    // Custom hook for Excel export
    const { exportSalesToExcel } = useExcelExport();

    const { data: saleData, isPending } = useSaleQuery(
        currentPage,
        itemsPerPage,
        "createdAt",
        "custom",
        serviceType.startDate,
        serviceType.endDate
    );

    const { data: dashboardStats } = useDashboardStatisticsQuery();

    const totalPages = Math.ceil((saleData?.totalElements || 0) / itemsPerPage);

    // console.log("SaleData:", saleData);

    const handleToggle = (id: string) => {
        saleData?.results?.forEach((sale) => {
            if (openSaleItems === null && sale.id === id) {
                console.log("Hit this block")
                setOpenSaleItems(sale.id);
                console.log("OpenSaleItems:", openSaleItems, id)
            }else if(openSaleItems === id) {
                console.log("Hit this block2")
                setOpenSaleItems(null);
            }
        });
    };

    // Handle simple export (current page only)
    const handleQuickExport = async () => {
        if (!saleData?.results || saleData.results.length === 0) {
            alert("No sales data available to export");
            return;
        }

        setIsExporting(true);

        setTimeout(() => {
            try {
                exportSalesToExcel(saleData.results, "sales-current-page");
            } catch (error) {
                console.error("Export failed:", error);
                alert("Failed to export data. Please try again.");
            } finally {
                setIsExporting(false);
            }
        }, 1000);
    };

    const statCards = getSalesStatCards(saleData);

    const handleViewDetails = (sale: GetSaleApiResponse) => {
        setSelectedSale(sale);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSale(null);
    };
    return {
        saleData,
        isPending,
        dashboardStats,
        totalPages,
        statCards,
        filterTypes,
        setCurrentPage,
        currentPage,
        handleToggle,
        handleQuickExport,
        isExporting,
        isModalOpen,
        selectedSale,
        handleCloseModal,
        handleViewDetails,
        openSaleItems,
        setOpenSaleItems,
        selectedFilterType,
        setSelectedFilterType,
        serviceType
    }
}

export default useSales