import { useDeleteTransactionRateMutation, useSetTransactionRateMutation } from "@/services/transactionService.tsx/transaction.mutation";
import { useGetAllTransactionRatesQuery, useGetAllTransactionsQuery } from "@/services/transactionService.tsx/transaction.query"
import { FilterTypes } from "@/types/pos";
import { SetRevenueRate } from "@/types/transaction";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useEffect, useState } from "react"

export interface FormError {
  name?: string;
  operator?: string;
  value?: string;
  secondValue?: string;
  percentage?: string;
  serviceType?: string;
  inOutType?: string;
}

export const useTransaction = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const [paymentServiceCategory, setPaymentServiceCategory] = useState("KPay")
  const [paymentTypeCategory, setPaymentTypeCategory] = useState("Transfer")
  const [currentPage, setCurrentPage] = useState(1);
  const [addRuleTransactionOpen, setAddRuleTransactionOpen] = useState(false);
  const [addRuleFormError, setAddRuleFormError] = useState<FormError>({})
  const [rateMutateLoading, setRateMutateLoading] = useState(false);
  const [deleteRateLoading, setDeleteRateLoading] = useState(false)

  const filterTypes: FilterTypes[] = [
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

  const [rateFilter, setRateFilter] = useState({
    serviceType: "KPay",
    type: "OUT"
  })

  // const operator = "GT"|| "LT" || "EQ" || "GTE" || "LTE" ||  "BETWEEN"

  const [formData, setFormData] = useState<SetRevenueRate>({
    name: "",
    operator: "GTE",
    value: 0,
    secondValue: 0,
    percentage: 0,
    serviceType: "KPay",
    inOutType: "IN",
  });


  const validateForm = () => {
    const newErrors: FormError = {}
    if (!formData.name || formData.name === '') {
      newErrors.name = "Name required"
    }
    if (!formData.operator || formData.operator === '') {
      newErrors.operator = "Operator required"
    }
    if (!formData.value || formData.value === 0) {
      newErrors.value = "Value required"
    }
    if (formData.operator === "BETWEEN" && !formData.secondValue) {
      newErrors.secondValue = "Second value required"
    }
    if (!formData.percentage) {
      newErrors.percentage = "Percentage required"
    }
    if (!formData.serviceType) {
      newErrors.serviceType = "Service type required"
    }
    if (!formData.inOutType) {
      newErrors.inOutType = "In/Out type required"
    }
    setAddRuleFormError(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateField = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const updateFilter = (key: string, value: string) => {
    setRateFilter({
      ...rateFilter,
      [key]: value
    })
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // console.log("UpdateWork", rateFilter)

  const cleanUpForm = () => {
    setFormData({
      name: "",
      operator: "GTE",
      value: 0,
      secondValue: 0,
      percentage: 0,
      serviceType: "KPay",
      inOutType: "IN",
    })
  }

  const serviceType = useSearch({
    strict: false,
  }) as { service: string, type: string, startDate: string, endDate: string,  filterBy: string }



  // const endDate = serviceType.date ? format(new Date(addDays(serviceType?.date, 1)), 'yyyy-MM-dd') : format(new Date(addDays(new Date(), 1)), 'yyyy-MM-dd')


  const itemsPerPage = 5;


  //Query 
  const { data: allTransactions, isPending, isError } = useGetAllTransactionsQuery(
    currentPage.toString(),
    itemsPerPage.toString(),
    serviceType.service ?? 'KPay',
    serviceType.type === "Received" ? "IN" : "OUT",
    serviceType.startDate,
    serviceType.endDate
    // serviceType.date
  );

  const {
    data: allTransactionRates,
    isPending: isPendingRates,
    isError: isErrorRates } = useGetAllTransactionRatesQuery(
      rateFilter.serviceType, rateFilter.type
    )


  const {
    mutate: transactionRateMutation,
    isPending: transactionRateMutatePending,
    isError: transactionRateMutateError
  } = useSetTransactionRateMutation();


  const {
    mutate: deleteTransactionRateMutation,
    isPending: deleteTransactionRateMutatePending,
    isError: deleteTransactionRateMutateError
  } = useDeleteTransactionRateMutation();


  const ClosureOfHandleSubmit = (setModalOpen: (value: boolean) => void) => {
    const handleTransactionFormSubmit: any = () => {
      setRateMutateLoading(true)
      if (!validateForm()) {
        setRateMutateLoading(false)
        return null;
      }
      transactionRateMutation(
        formData,
        {
          onSuccess: (data) => {
            console.log("setRate:", data)
            setModalOpen(false)
            queryClient.invalidateQueries({
              queryKey: ['transaction-rates']
            })
          },
          onError: () => {
            console.log("setRate error")

          },
          onSettled: () => {
            cleanUpForm()
            setRateMutateLoading(false)
          }
        }
      )
    }

    return {
      handleTransactionFormSubmit
    }
  }


  const handleTransactionRateDelete = (id: string) => {
    setDeleteRateLoading(true)
    deleteTransactionRateMutation(
      id,
      {
        onSuccess: (data) => {
          console.log("deleteRate:", data)
          queryClient.invalidateQueries({
            queryKey: ['transaction-rates']
          })
        },
        onError: () => {
          console.log("deleteRate error")
        },
        onSettled: () => {
          setDeleteRateLoading(false)
        }
      }
    )
  }

  const totalPages = Math.ceil((allTransactions?.pagination?.totalCount || 0) / itemsPerPage);

  return {
    allTransactions,
    isPending,
    isError,
    transactionRateMutation,
    transactionRateMutatePending,
    transactionRateMutateError,
    allTransactionRates,
    isPendingRates,
    isErrorRates,


    //Form

    serviceType,
    formData,
    filterTypes,
    selectedFilterType,
    setSelectedFilterType,



    //Funciton
    updateField,
    updateFilter,
    ClosureOfHandleSubmit,
    validateForm,
    formatNumber,
    handleTransactionRateDelete,

    // State
    paymentServiceCategory,
    setPaymentServiceCategory,
    paymentTypeCategory,
    setPaymentTypeCategory,
    currentPage,
    setCurrentPage,
    addRuleTransactionOpen,
    setAddRuleTransactionOpen,
    addRuleFormError,
    rateMutateLoading,
    rateFilter,
    setRateFilter,
    deleteRateLoading,

    //Pagination
    totalPages
  }
}