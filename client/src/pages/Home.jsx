import { Link } from 'react-router';
import {
    MessageSquare,
    BarChart3,
    Shield,
    Clock,
    CheckCircle,
    ArrowRight,
    FileText,
    Target,
    Star,
    Globe
} from 'lucide-react';


import { dashboardAPI } from "../services/api";
import { useApi } from '../hooks/useApi';


const HomePage = () => {
     const {
        data: stats
      } = useApi(dashboardAPI.getStats);
    const features = [
        {
            icon: MessageSquare,
            title: 'Easy Complaint Submission',
            description: 'Submit your public service complaints with detailed information and track their progress in real-time.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: BarChart3,
            title: 'Data-Driven Insights',
            description: 'View comprehensive dashboards showing complaint trends, resolution rates, and department performance.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Shield,
            title: 'Transparent Process',
            description: 'Every complaint is logged, tracked, and managed transparently with regular status updates.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Clock,
            title: 'Timely Resolution',
            description: 'Automated escalation ensures complaints are resolved within specified timeframes.',
            color: 'from-orange-500 to-red-500'
        }
    ];

    const statistics = [
        {
            number: stats?.total_complaints || 0,
            label: 'Total Complaints',
            icon: FileText,
            color: 'from-blue-500 to-blue-600'
        },
        {
            number: stats?.resolved_complaints || 0,
            label: 'Resolved',
            icon: CheckCircle,
            color: 'from-green-500 to-green-600'
        },
        {
            number: '8',
            label: 'Cities Covered',
            icon: Globe,
            color: 'from-purple-500 to-purple-600'
        },
        {
            number: '4.0/5',
            label: 'Satisfaction Rate',
            icon: Star,
            color: 'from-yellow-500 to-orange-500'
        }
    ];

    const services = [
        { name: 'Water Supply', color: 'from-blue-400 to-blue-600', icon: '💧' },
        { name: 'Electricity', color: 'from-yellow-400 to-yellow-600', icon: '⚡' },
        { name: 'Waste Management',  color: 'from-green-400 to-green-600', icon: '🗑️' },
        { name: 'Road Maintenance', color: 'from-gray-400 to-gray-600', icon: '🛣️' },
        { name: 'Traffic Issues', color: 'from-red-400 to-red-600', icon: '🚦' },
        { name: 'Parks & Recreation', color: 'from-emerald-400 to-emerald-600', icon: '🌳' }
    ];

    const testimonials = [
        {
            name: 'Ahmed Hassan',
            city: 'Karachi',
            comment: 'Smart Shehri helped resolve my water supply issue within 2 days. Excellent service!',
            rating: 5,
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
        },
        {
            name: 'Fatima Khan',
            city: 'Lahore',
            comment: 'The transparency in tracking complaints is amazing. I could see every update.',
            rating: 5,
            avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
        },
        {
            name: 'Muhammad Ali',
            city: 'Islamabad',
            comment: 'Finally, a platform where citizens voice actually matters. Highly recommended!',
            rating: 4,
            avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                    <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="inline-flex items-center space-x-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                                <MessageSquare className="h-6 w-6 text-blue-300" />
                                <span className="text-blue-100 font-medium">Smart City Platform</span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                            Smart Shehri
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                            Your voice matters. Report public service issues, track their resolution,
                            and help build better Pakistani cities through technology.
                        </p>
                      

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                to="/submit-complaint"
                                className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2"
                            >
                                <MessageSquare className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                <span>Submit Complaint</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/dashboard"
                                className="group border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300 backdrop-blur-sm bg-white bg-opacity-10 flex items-center justify-center space-x-2"
                            >
                                <BarChart3 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                <span>View Dashboard</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {statistics.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center group">
                                    <div className={`bg-gradient-to-r ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-700 font-medium">{stat.label}</div>
                                    <div className="text-sm text-gray-500">{stat.labelUrdu}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            How Smart Shehri Works
                        </h2>
                        <p className="text-xl text-gray-600 mb-2">
                            A comprehensive platform for citizen engagement
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                    <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <Icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 font-medium">
                                        {feature.titleUrdu}
                                    </p>
                                    <p className="text-gray-600 mb-4 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Public Services We Cover
                        </h2>
                        <p className="text-xl text-gray-600 mb-2">
                            Report issues across multiple city departments
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    {service.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm mb-2">
                                    {service.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            What Citizens Say
                        </h2>
                        <p className="text-xl text-gray-600 mb-2">
                            Real feedback from real people
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100"
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover mr-4"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-500">{testimonial.city}</p>
                                    </div>
                                </div>
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Make Your City Better?
                    </h2>
                    <p className="text-xl mb-4 text-blue-100">
                        Join thousands of citizens making a difference
                    </p>
                  
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            to="/submit-complaint"
                            className="group bg-white text-blue-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-flex items-center justify-center space-x-2"
                        >
                            <FileText className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                            <span>Submit Your First Complaint</span>
                        </Link>
                        <Link
                            to="/dashboard"
                            className="group border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-700 transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm bg-white bg-opacity-10"
                        >
                            <Target className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span>Explore Analytics</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;