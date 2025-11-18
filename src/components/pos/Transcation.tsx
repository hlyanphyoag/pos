import { useState } from 'react';
import { Upload, DollarSign, ArrowUpRight, ArrowDownLeft, LucideArrowLeftRight } from 'lucide-react';
import KPay from "../../../public/KPay.jpg";
import WavePay from "../../../public/WavePay.jpg";
import { useTransactionMutation } from '../../services/transactionService.tsx/transaction.mutation';

interface FormData {
    screenshot: File | null;
    quantity: string;
    serviceType: string;
    type: string;
}

interface FormErrors {
    screenshot?: string;
    quantity?: string;
    serviceType?: string;
    type?: string;
}

const paymentServices = [
    { id: 'kpay', label: 'KPay', image: KPay },
    { id: 'wavepay', label: 'WavePay', image: WavePay },
];

const transactionTypes = [
    { type: 'IN', label: 'Received (Cash Out)', icon: ArrowDownLeft, bg: 'border-green-500 bg-green-50 text-green-700'},
    { type: 'OUT', label: 'Transfer', icon: ArrowUpRight, bg: 'border-red-500 bg-red-50 text-red-700'}
]

export default function TransactionRecordForm() {
    const [formData, setFormData] = useState<FormData>({
        screenshot: null,
        quantity: '',
        serviceType: '',
        type: ''
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const { mutate: addTransactionMutation, isPending: isAddingTransaction, error: addTransactionError } = useTransactionMutation();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    console.log("FormData:", typeof(formData.screenshot), formData.screenshot)



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, screenshot: 'Please upload a valid image file (JPEG, PNG, GIF, WebP)' }));
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, screenshot: 'File size must be less than 5MB' }));
                return;
            }



            console.log("File:", file)

            setFormData(prev => ({ ...prev, screenshot: file }));
            setErrors(prev => ({ ...prev, screenshot: undefined }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.screenshot) {
            newErrors.screenshot = 'Screenshot is required';
        }
        if (!formData.quantity || Number(formData.quantity) <= 0) {
            newErrors.quantity = 'Please enter a valid amount';
        }
        if (!formData.serviceType) {
            newErrors.serviceType = 'Please select a payment service';
        }
        if (!formData.type) {
            newErrors.type = 'Please select transaction type';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // validate form before sending
        if (!validateForm()) {
            setIsLoading(false)
            return;
        };

        // build payload that matches TransactionPayload expected by the mutation
        const payload = {
            screenshotFile: formData.screenshot as File,
            quantity: Number(formData.quantity),
            serviceType: formData.serviceType,
            type: formData.type,
        };

        addTransactionMutation(
            payload,
            {
                onSuccess: (data) => {
                    console.log('Transaction recorded:', data);
                    // reset form on success
                    setIsLoading(false)
                    setFormData({
                        screenshot: null,
                        quantity: '',
                        serviceType: '',
                        type: ''
                    });

                    setPreview(null);
                },
                onError: (error) => {
                    setIsLoading(false)
                    console.log('Error:', error)
                }
            }
        )
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 mt-16 to-indigo-100 p-6 flex items-center justify-center">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-100 p-3 rounded-full">
                        <LucideArrowLeftRight className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Add Transaction Record</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Screenshot Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Screenshot <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                                id="screenshot-upload"
                            />
                            <label
                                htmlFor="screenshot-upload"
                                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition ${errors.screenshot ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-6">
                                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                        <p className="text-sm text-gray-600 font-medium">Click to upload screenshot</p>
                                        <p className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF, WebP (max 5MB)</p>
                                    </div>
                                )}
                            </label>
                        </div>
                        {errors.screenshot && (
                            <p className="mt-1 text-sm text-red-600">{errors.screenshot}</p>
                        )}
                    </div>

                    {/* Service Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Payment Service <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {paymentServices.map((service) => (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => handleInputChange('serviceType', service.label)}
                                    className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-1 font-medium transition ${formData.serviceType === service.label
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <img src={service.image} alt={service.label} className='h-12 w-12' />
                                    {service.label}
                                </button>
                            ))}
                        </div>
                        {errors.serviceType && (
                            <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
                        )}
                    </div>

                    {/* Transaction Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Transaction Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {transactionTypes.map((transaction) => (
                                <button
                                key={transaction.label}
                                type="button"
                                onClick={() => handleInputChange('type', transaction.type)}
                                className={`p-4 rounded-lg border-2 font-medium transition flex items-center justify-center gap-2 ${formData.type === transaction.type
                                        ? transaction.bg
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <transaction.icon className="w-5 h-5" />
                                {transaction.label}
                            </button>
                            ))}
                        </div>
                        {errors.type && (
                            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Amount <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => handleInputChange('quantity', e.target.value)}
                                placeholder="Enter transaction amount"
                                className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.quantity
                                        ? 'border-red-300 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-indigo-200'
                                    }`}
                            />
                            <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.quantity && (
                            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full bg-indigo-600  flex items-center justify-center gap-4 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isAddingTransaction || isLoading}
                    >
                        {isLoading && (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        Add Transaction Record
                    </button>
                </form>
            </div>
        </div>
    );
}