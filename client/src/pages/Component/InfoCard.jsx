const InfoCard = ({
    title,
    subtitle,
    icon: Icon,
    iconBg = 'bg-blue-100',
    iconColor = 'text-blue-600',
    fields = [],
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`${iconBg} p-3 rounded-xl`}>
                    {Icon && <Icon className={`h-6 w-6 ${iconColor}`} />}
                </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}

            <div className="space-y-3">
                {fields.map(({ label, value }) => (
                    <div
                        key={label}
                        className="flex justify-between items-center"
                    >
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className="font-medium text-gray-900">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoCard;
  