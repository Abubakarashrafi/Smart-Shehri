
import { Link, useLocation } from 'react-router';
import { MessageSquare, BarChart3, Shield, FileText} from 'lucide-react';

const Header = () => {
    const location = useLocation();

    const navigationItems = [
        { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
        { name: 'Submit Complaint', href: '/submit-complaint', icon: MessageSquare},
        { name: 'Complaints', href: '/complaints', icon: FileText },
        { name: 'Admin', href: '/admin', icon: Shield },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white shadow-xl border-b-4 border-gradient-to-r from-blue-600 to-purple-600 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                            <MessageSquare className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                                Smart Shehri
                            </h1>
                        </div>
                    </Link>

                
                    <nav className="hidden md:flex space-x-1">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.href)
                                            ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md border border-blue-200'
                                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50 hover:text-blue-600'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;