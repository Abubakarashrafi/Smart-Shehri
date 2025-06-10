import  { useState } from 'react';
import {
    Users,
    Building,
    MapPin,
    FileText,
    BarChart3,
    Plus,
    Edit,
    Trash2,
    Eye,
    Star,
    
} from 'lucide-react';

import { departmentsAPI, workersAPI, citiesAPI,complaintsAPI } from '../services/api';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from './Component/LoadingSpinner';
import {EfficiencyBar} from './Component/EfficencyBar'

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showModal, setShowModal] = useState(false);
    const [errors,setErrors] = useState('');
    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState('');

    
    const { data: departments, loading: deptLoading, error: deptError} = useApi(departmentsAPI.getAll);
    const { data: workers, loading: workersLoading, error: workersError } = useApi(workersAPI.getAll);
    const { data: cities, loading: citiesLoading, error: citiesError } = useApi(citiesAPI.getAll);
    const {data: complaint} = useApi(complaintsAPI.getAll)
    const tabs = [
        { id: 'overview', name: 'Overview', icon: BarChart3 },
        { id: 'departments', name: 'Departments', icon: Building },
        { id: 'workers', name: 'Workers', icon: Users },
        { id: 'cities', name: 'Cities', icon: MapPin },
    ];

   

    const handleAdd = (type) => {
        setModalType(type);
        setShowModal(true);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (modalType === 'department') {
           
            const { name, phone_number, email,city_id } = formData;

            if (!name || name.trim().length < 3) {
                newErrors.name = 'Name must be at least 3 characters long';
            } else if (!/^[A-Za-z\s]+$/.test(name)) {
                newErrors.name = 'Name must contain alphabets only';
            }

            if (!phone_number) {
                newErrors.phone_number = 'Phone number is required';
            } else if (!/^\d+$/.test(phone_number)) {
                newErrors.phone_number = 'Phone must contain digits only';
            } else if (phone_number.length < 10) {
                newErrors.phone_number = 'Invalid phone number';
            }

            if (!email || !emailRegex.test(email)) {
                newErrors.email = 'Invalid email format';
            }
            if(!city_id){
                newErrors.city_id = 'select city';
            }
          

            setErrors(newErrors);

            if (Object.keys(newErrors).length === 0) {
                try {
                    await departmentsAPI.create(formData);
                    setShowModal(false);
                   
                } catch (err) {
                    console.error('Failed to create department:', err);
                }finally{
                    setErrors(null);
                    
                }
            }
        } else if (modalType === 'worker') {
          
            try {
                const {worker_name,worker_email,worker_phone_number,department_id} = formData;
                if (!worker_name || worker_name.trim().length < 3) {
                    newErrors.worker_name = 'Name must be at least 3 characters long';
                } else if (!/^[A-Za-z\s]+$/.test(worker_name)) {
                    newErrors.worker_name = 'Name must contain alphabets only';
                }

                if (!worker_phone_number) {
                    newErrors.worker_phone_number = 'Phone number is required';

                } else if (!/^\d+$/.test(worker_phone_number)) {
                    newErrors.worker_phone_number = 'Phone must contain digits only';

                } else if (worker_phone_number.length < 10) {
                    newErrors.worker_phone_number = 'Invalid phone number';
                }

                if (!worker_email || !emailRegex.test(worker_email)) {
                    newErrors.worker_email = 'Invalid email format';
                }
                if (!department_id) {
                    newErrors.department_id = 'select department';
                }

                setErrors(newErrors);
                
                
                if (Object.keys(newErrors).length === 0) {
                    try {
                        console.log(formData);
                        
                        await workersAPI.create({name:worker_name,email:worker_email,phone:worker_phone_number,department_id});
                        setShowModal(false);
                    } catch (err) {
                        console.error('Failed to create department:', err);
                    }
                }
               
                
            } catch (err) {
                console.error('Failed to create worker:', err);
            }
        } else if (modalType === 'city') {
            const { name, province } = formData;
            if (!name) newErrors.name = 'City name is required';
            if (!province) newErrors.province = 'Province is required';

            setErrors(newErrors);

            if (Object.keys(newErrors).length === 0) {
                try {
                    await citiesAPI.create(formData);
                    setShowModal(false);
                } catch (err) {
                    console.error('Failed to create city:', err);
                }
            }
        }
    };
    
    

    const renderOverview = () => (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Departments</p>
                            <p className="text-3xl font-bold">{departments?.length || 0}</p>
                        </div>
                        <Building className="h-8 w-8 text-blue-200" />
                    </div>
                  
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Active Workers</p>
                            <p className="text-3xl font-bold">{workers?.length || 0}</p>
                        </div>
                        <Users className="h-8 w-8 text-green-200" />
                    </div>
                 
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Cities Covered</p>
                            <p className="text-3xl font-bold">{cities?.length || 0}</p>
                        </div>
                        <MapPin className="h-8 w-8 text-purple-200" />
                    </div>
                   
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Total Complaints</p>
                            <p className="text-3xl font-bold">{complaint?.pagination?.totalCount}</p>
                        </div>
                        <FileText className="h-8 w-8 text-orange-200" />
                    </div>
                 
                </div>
            </div>

            

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Department Performance</h3>
                    {deptLoading ? (
                        <LoadingSpinner text="Loading departments..." />
                    ) : deptError ? (
                       <p>Something went wrong try again</p>
                    ) : (
                        <div className="space-y-4">
                            {departments.map((dept) => (
                                <div key={dept.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{dept.name}</h4>
                                        <p className="text-sm text-gray-500">{dept.worker_count} workers • {dept.complaint_count} complaints</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">{dept?.efficiency_percent || 0}%</p>
                                            <p className="text-xs text-gray-500">Efficiency</p>
                                        </div>
                                       <EfficiencyBar percentage = {Number(dept.efficiency_percent) || 0}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Active Workers</h3>
                    {workersLoading ? (
                        <LoadingSpinner text="Loading workers..." />
                    ) : workersError ? (
                            <p>Something went wrong try again</p>
                    ) : (
                        <div className="space-y-4">
                            {workers?.map((worker) => (
                                <div key={worker.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{worker.name}</h4>
                                        <p className="text-sm text-gray-500">{worker.designation} • {worker.active_assignments} active</p>
                                    </div>
                                   
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderDepartments = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Departments Management</h2>
                    <p className="text-gray-600">Manage city departments and their operations</p>
                </div>
                <div className="flex items-center space-x-4">
                    
                    <button
                        onClick={() => handleAdd('department')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Department</span>
                    </button>
                </div>
            </div>

            {deptLoading ? (
                <LoadingSpinner size="lg" text="Loading departments..." />
            ) : deptError ? (
                    <p>Something went wrong try again</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments?.map((dept) => (
                        <div key={dept.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-blue-100 p-3 rounded-xl">
                                    <Building className="h-6 w-6 text-blue-600" />
                                </div>
                                
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{dept.city_name}</p>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Workers</span>
                                    <span className="font-medium text-gray-900">{dept.worker_count}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Complaints</span>
                                    <span className="font-medium text-gray-900">{dept.complaint_count}</span>
                                </div>
                                
                            </div>

                           
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderWorkers = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Workers Management</h2>
                    <p className="text-gray-600">Manage department workers and assignments</p>
                </div>
                <div className="flex items-center space-x-4">
                   
                    <button
                        onClick={() => handleAdd('worker')}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Worker</span>
                    </button>
                </div>
            </div>

            {workersLoading ? (
                <LoadingSpinner size="lg" text="Loading workers..." />
            ) : workersError ? (
                    <p>Something went wrong try again</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workers?.map((worker) => (
                        <div key={worker.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-green-100 p-3 rounded-xl">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-1">{worker.name}</h3>
                            <p className="text-xs text-gray-400 mb-4">{worker.department_name}</p>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Active Assignments</span>
                                    <span className="font-medium text-gray-900">{worker.active_assignments}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Employee ID</span>
                                    <span className="font-medium text-gray-900">{worker.id}</span>
                                </div>
                            </div>

                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderCities = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Cities Management</h2>
                    <p className="text-gray-600">Manage cities and their statistics</p>
                </div>
                <button
                    onClick={() => handleAdd('city')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add City</span>
                </button>
            </div>

            {citiesLoading ? (
                <LoadingSpinner size="lg" text="Loading cities..." />
            ) : citiesError ? (
                    <p>Something went wrong try again</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cities?.map((city) => (
                        <div key={city.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-purple-100 p-3 rounded-xl">
                                    <MapPin className="h-6 w-6 text-purple-600" />
                                </div>
                               
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{city.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{city.province}</p>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                   
                                </div>
                              
                              
                            </div>

                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );


    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'departments':
                return renderDepartments();
            case 'workers':
                return renderWorkers();
            case 'cities':
                return renderCities();
            

            default:
                return renderOverview();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Admin Panel
                    </h1>
                  
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{tab.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">
                                Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                            </h2>

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {modalType === 'department' && (
                                    <>
                                        <input
                                            name="name"
                                            placeholder="Department Name"
                                            className="w-full border px-3 py-2 rounded mb-3"
                                            onChange={handleChange}
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                        <input
                                            name="email"
                                            placeholder="Department Email"
                                            className="w-full border px-3 py-2 rounded mb-3"
                                            onChange={handleChange}
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                        <input
                                            name="phone_number"
                                            placeholder="Phone Number"
                                            className="w-full border px-3 py-2 rounded mb-3"
                                            onChange={handleChange}
                                        />
                                        {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                                        <select
                                            name="city_id"
                                            className="w-full border px-3 py-2 rounded mb-3"
                                            onChange={handleChange}
                                        >
                                         
                                            <option value="">Select City</option>
                                            {cities?.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                        {errors.city_id && <p className="text-sm text-red-500">{errors.city_id}</p>}
                                    </>
                                )}

                                {modalType === 'worker' && (
                                    <>
                                        <input
                                            name="worker_name"
                                            placeholder="Worker Name"
                                            className="w-full border px-3 py-2 rounded mb-3"
                                            onChange={handleChange}
                                        />
                                        {errors.worker_name && <p className="text-sm text-red-500">{errors.worker_name}</p>}

                                        <input
                                            name="worker_email"
                                            placeholder="Email"
                                            className="w-full border px-3 py-2 rounded mb-3"
                                            onChange={handleChange}
                                        />
                                        {errors.worker_email && <p className="text-sm text-red-500">{errors.worker_email}</p>}

                                        <input
                                            name="worker_phone_number"
                                            placeholder="phone number"
                                            className="w-full border px-3 py-2 rounded mb-3"
                                            onChange={handleChange}
                                        />
                                        {errors.worker_phone_number && <p className="text-sm text-red-500">{errors.worker_phone_number}</p>}

                                        <select
                                            name="department_id"
                                            className="w-full border px-3 py-2 rounded mb-3"
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Department</option>
                                            {departments?.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                        {errors.department_id && <p className="text-sm text-red-500">{errors.department_id}</p>}

                                    </>
                                )}

                                {modalType === 'city' && (
                                    <>
                                        <input
                                            name="name"
                                            placeholder="City Name"
                                            className="w-full border px-3 py-2 rounded mb-3"
                                            onChange={handleChange}
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                        <input
                                            name="province"
                                            placeholder="Province"
                                            className="w-full border px-3 py-2 rounded mb-3"
                                            onChange={handleChange}
                                        />
                                        {errors.province && <p className="text-sm text-red-500">{errors.province}</p>}
                                    </>
                                )}

                                <div className="flex justify-end space-x-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                </div>
                               
                            </form>
                        </div>
                    </div>
                )}


                {/* Content */}
                <div className="transition-all duration-300">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;