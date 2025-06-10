import { useState, useEffect } from 'react';
import {
    MapPin,
  
    AlertCircle,
    CheckCircle,
    Send,
    User,
    FileText,
    Upload,
    X,
    Clock,
    Shield,
    ArrowRight
} from 'lucide-react';

import { citiesAPI, categoriesAPI, complaintsAPI,citizenApi } from '../services/api';
import { useApi, useApiSubmit } from '../hooks/useApi';
import LoadingSpinner from './Component/LoadingSpinner';

const ComplaintForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
       
        citizen_name: '',
        citizen_email: '',
        citizen_phone: '',

        city_id: '',
        location_id: '',
        category_id: '',
        title: '',
        description: '',
        priority: 3,

        address: '',
        landmark: '',
        
    });

    const [filteredLocations, setFilteredLocations] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [errors, setErrors] = useState({});

    
    const { data: cities, loading: citiesLoading, error: citiesError } = useApi(citiesAPI.getAll);
    const { data: categories, loading: categoriesLoading, error: categoriesError } = useApi(categoriesAPI.getAll);
    const { submit, loading: submitting, error: submitError, success: submitSuccess } = useApiSubmit();
    useEffect(() => {
        if (formData.city_id && cities) {
            citiesAPI.getLocations(formData.city_id)
                .then(locations => setFilteredLocations(locations))
                .catch(error => console.error('Error fetching locations:', error));
        } else {
            setFilteredLocations([]);
        }
    }, [formData.city_id, cities]);

    useEffect(() => {
        if (categories) {
            setFilteredCategories(categories);
        }
    }, [categories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
      
        
        setFormData(prev => ({
            ...prev,
            [name]: name === 'priority' ? Number(value) : value 
        }));

       
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.citizen_name.trim()) newErrors.citizen_name = 'Name is required';
            if (!/^[A-Za-z\s]+$/.test(formData.citizen_name))
            newErrors.citizen_name = 'Name cannot contain numbers or tabs';
        
            if(formData.citizen_name.trim()<5) newErrors.citizen_name = 'Name must be atleast 5 characters'

            if (!formData.citizen_phone.trim()) newErrors.citizen_phone = 'Phone is required';

            if (!/^[0-9]+$/.test(formData.citizen_phone)) newErrors.citizen_phone = 'Phone must contain numbers only'
            
            if (formData.citizen_phone.length < 9) 
            newErrors.citizen_phone = 'Phone must be at least 9 digits'

            if (!formData.citizen_email.trim()) newErrors.citizen_email = 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (formData.citizen_email && !emailRegex.test(formData.citizen_email)) {
                newErrors.citizen_email = 'Invalid email format';
            }
        }

        if (step === 2) {
            if (!formData.city_id) newErrors.city_id = 'City is required';
            if (!formData.category_id) newErrors.category_id = 'Category is required';
            if(formData.address.trim() <5) newErrors.address = 'address must contain 5 characters'; 
            if(formData.landmark.trim() <5) newErrors.landmark = 'landmark must contain 5 characters'; 

        }

        if (step === 3) {
            if (!formData.title.trim()) newErrors.title = 'Title is required';
            if (!formData.description.trim()) newErrors.description = 'Description is required';
            if (formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
            if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(3)) {
            return;
        }

        try {
            const citizenData = {
                fullName: formData.citizen_name,
                email: formData.citizen_email,
                phone: formData.citizen_phone,
                city_id: parseInt(formData.city_id),
                address: formData.address,
            };
            const res= await submit(citizenApi.create,citizenData)
    
            const complaintData = {
                citizen_id: res.id,
                category_id: parseInt(formData.category_id),
                city_id: parseInt(formData.city_id),
                location_id: parseInt(formData.location_id),
                title: formData.title,
                description: formData.description,
                priority: parseInt(formData.priority),
                };

         result= await submit(complaintsAPI.create, complaintData);
          setCurrentStep(4);

        } catch (error) {
            console.error('Error submitting complaint:', error);
        }
    };

    const priorityOptions = [
        { value: 1, label: 'Low', color: 'text-gray-600', bg: 'bg-gray-100' },
        { value: 2, label: 'Medium', color: 'text-blue-600', bg: 'bg-blue-100' },
        { value: 3, label: 'High', color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { value: 4, label: 'Critical', color: 'text-orange-600', bg: 'bg-orange-100' },
        { value: 5, label: 'Critical', color: 'text-red-600', bg: 'bg-red-100' }
    ];


    const steps = [
        { number: 1, title: 'Personal Info', icon: User },
        { number: 2, title: 'Location & Category', icon: MapPin },
        { number: 3, title: 'Complaint Details', icon: FileText },
        { number: 4, title: 'Confirmation',  icon: CheckCircle }
    ];

    const renderStepIndicator = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;

                    return (
                        <div key={step.number} className="flex items-center">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${isActive
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                                    : isCompleted
                                        ? 'bg-green-600 border-green-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-400'
                                }`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="ml-3 hidden sm:block">
                                <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                                    {step.title}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`hidden sm:block w-16 h-0.5 ml-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="citizen_name"
                        value={formData.citizen_name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.citizen_name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter your full name"
                    />
                    {errors.citizen_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.citizen_name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address  *
                    </label>
                    <input
                        type="email"
                        name="citizen_email"
                        value={formData.citizen_email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.citizen_email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="your.email@example.com"
                    />
                    {errors.citizen_email && (
                        <p className="mt-1 text-sm text-red-600">{errors.citizen_email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        name="citizen_phone"
                        value={formData.citizen_phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.citizen_phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="+92-300-1234567"
                    />
                    {errors.citizen_phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.citizen_phone}</p>
                    )}
                </div>

            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Location & Category</h2>
            </div>

            {citiesLoading && <LoadingSpinner text="Loading cities..." />}
            {citiesError && <p>Something went wrong try again</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                    </label>
                    <select
                        name="city_id"
                        value={formData.city_id}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.city_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                        disabled={citiesLoading}
                    >
                        <option value="">Select a city</option>
                        {cities?.map(city => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                    {errors.city_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.city_id}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area/Location 
                    </label>
                    <select
                        name="location_id"
                        value={formData.location_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled={!formData.city_id}
                    >
                        <option value="">Select an area</option>
                        {filteredLocations.map(location => (
                            <option key={location.id} value={location.id}>
                                {location.name} 
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                    Category *
                </label>
                {categoriesLoading && <LoadingSpinner text="Loading categories..." />}
                {categoriesError && <p>Something went wrong try again later</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                        {filteredCategories?.map((category) => {
                           
                            let icon, bgColor, borderColor;

                            switch (category.name.toLowerCase()) {
                                case "electricity outages":
                                    icon = "⚡";
                                    bgColor = "bg-yellow-100";
                                    borderColor = "border-yellow-500";
                                    break;
                                case "garbage collection":
                                    icon = "🗑️";
                                    bgColor = "bg-green-100";
                                    borderColor = "border-green-500";
                                    break;
                                case "parks maintenance":
                                    icon = "🌳";
                                    bgColor = "bg-emerald-100";
                                    borderColor = "border-emerald-500";
                                    break;
                                case "road conditions":
                                    icon = "🛣️";
                                    bgColor = "bg-orange-100";
                                    borderColor = "border-orange-500";
                                    break;
                                case "sewage problems":
                                    icon = "💧";
                                    bgColor = "bg-cyan-100";
                                    borderColor = "border-cyan-500";
                                    break;
                                case "street lighting":
                                    icon = "💡";
                                    bgColor = "bg-blue-100";
                                    borderColor = "border-blue-500";
                                    break;
                                case "traffic signals":
                                    icon = "🚦";
                                    bgColor = "bg-red-100";
                                    borderColor = "border-red-500";
                                    break;
                                case "water supply issues":
                                    icon = "🚰";
                                    bgColor = "bg-sky-100";
                                    borderColor = "border-sky-500";
                                    break;
                                default:
                                    icon = "📋";
                                    bgColor = "bg-gray-100";
                                    borderColor = "border-gray-500";
                            }

                            return (
                                <div
                                    key={category.id}
                                    onClick={() =>
                                        setFormData((prev) => ({ ...prev, category_id: category.id }))
                                    }
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 
                                       ${
                                        formData.category_id === category.id
                                            ? `${bgColor.replace("100", "200")} `  
                                            : `${bgColor}`
                                        }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-2xl `}
                                    >
                                        {icon}
                                    </div>
                                    <h3 className="font-medium text-gray-900 text-sm mb-1">
                                        {category.name}
                                    </h3>
                                </div>
                            );
                        })}
                    </div>
                    {errors.category_id && (
                        <p className="mt-2 text-sm text-red-600">{errors.category_id}</p>
                    )}  
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Detailed Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.address ? 'border-red-500' : 'border-gray-300'} `}
                        placeholder="House/Building number, street name, etc."
                    />
                    {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nearby Landmark 
                    </label>
                    <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        
                        className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.landmark ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Near mosque, school, market, etc."
                        
                    />
                    {errors.landmark && (
                        <p className="mt-1 text-sm text-red-600">{errors.landmark}</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Details</h2>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complaint Title *
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Brief summary of the issue"
                    maxLength={200}
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                    {formData.title.length}/200 characters
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Provide detailed information about the issue, when it started, how it affects you, etc."
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Priority Level
                    </label>
                    <div className="space-y-2">
                        {priorityOptions.map(option => (
                            
                            
                            <label key={option.value} className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="priority"
                                    value={option.value}
                                    checked={formData.priority === option.value}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                />
                                <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 ${formData.priority === option.value
                                        ? `${option.borderColor || 'border-blue-500'} ${option.bg}`
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <div className={`w-4 h-4 rounded-full border-2 ${formData.priority === option.value
                                            ? `${option.dotColor || 'border-blue-500 bg-blue-500'}`
                                            : 'border-gray-300'
                                        }`}>
                                        {formData.priority === option.value && (
                                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                        )}
                                    </div>
                                    <span className={`font-medium ${option.textColor || option.color || 'text-gray-700'}`}>
                                        {option.label}
                                    </span>
                                   
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );

    const renderStep4 = () => (
        <div className="text-center space-y-6">
            {submitSuccess ? (
                <>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Complaint Submitted Successfully!
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                        Your complaint has been registered and assigned ID: <strong>${result.id}</strong>
                    </p>
                  

                    <div className="bg-blue-50 rounded-xl p-6 mb-8">
                        <h3 className="font-semibold text-blue-900 mb-4">What happens next?</h3>
                        <div className="space-y-3 text-left">
                            <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <span className="text-blue-800">Your complaint will be reviewed within 24 hours</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <User className="h-5 w-5 text-blue-600" />
                                <span className="text-blue-800">A worker will be assigned to resolve the issue</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <span className="text-blue-800">You'll receive regular updates on progress</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => {
                                setCurrentStep(1);
                                setFormData({
                                    citizen_name: '',
                                    citizen_email: '',
                                    citizen_phone: '',
                                    citizen_cnic: '',
                                    city_id: '',
                                    location_id: '',
                                    category_id: '',
                                    title: '',
                                    description: '',
                                    priority: 3,
                                   
                                    address: '',
                                    landmark: '',
                                  
                                });
                            }}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Submit Another Complaint
                        </button>
                     
                    </div>
                </>
            ) : (
                <>
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-12 w-12 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Submission Failed
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        There was an error submitting your complaint. Please try again.
                    </p>
                    {submitError && (
                        <ErrorMessage error={submitError} />
                    )}
                    <button
                        onClick={() => setCurrentStep(3)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Submit a Complaint
                    </h1>
                    <p className="text-lg text-gray-600 mb-1">
                        Report public service issues in your city
                    </p>
                   
                </div>

                
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {renderStepIndicator()}

                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}

                       
                        {currentStep < 4 && (
                            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {currentStep === 3 ? (
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5" />
                                                <span>Submit Complaint</span>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                                    >
                                        <span>Next</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ComplaintForm;