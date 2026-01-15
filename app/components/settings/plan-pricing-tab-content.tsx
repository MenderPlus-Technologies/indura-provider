import { FaCheck } from 'react-icons/fa';

export default function PlanPricingTabContent() {
  const plans = [
    {
      name: 'Basic Plan',
      price: 29,
      description: 'All the basics for starting a new business',
      features: [
        'Up to 2 staff members',
        'Up to 4 locations',
        'Fraud analysis',
        'Professional reports'
      ],
      badge: 'Downgrade',
      badgeStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    },
    {
      name: 'Pro Plan',
      price: 79,
      description: 'Everything you need for a growing business',
      features: [
        'Up to 5 staff members',
        'Up to 5 locations',
        'Fraud analysis',
        'Professional reports'
      ],
      badge: 'Current Plan',
      badgeStyle: 'bg-gray-100 text-gray-700',
      isCurrent: true
    },
    {
      name: 'Advanced Plan',
      price: 299,
      description: 'Advanced features for scaling your business',
      features: [
        'Up to 15 staff members',
        'Up to 10 locations',
        'Fraud analysis',
        'Professional reports'
      ],
      badge: 'Free Trial - 30 Days',
      badgeStyle: 'bg-teal-600 text-white hover:bg-teal-700'
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-950 pb-8">
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Section */}
          <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Plan & Pricing
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your subscription plans. Choose a plan that best suits your needs, compare features, and adjust your subscription as needed
            </p>
          </div>

          <div className="space-y-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-lg border transition-all ${
                plan.isCurrent ? 'border-2 border-teal-600 dark:border-teal-500' : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="">
                {/* Header */}
                <div className={`flex bg-[#F9F9FB] dark:bg-gray-700 p-4 items-start justify-between mb-4 rounded-t-lg transition-all`}>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h2>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      plan.isCurrent 
                        ? 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300' 
                        : plan.badge === 'Downgrade'
                        ? 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        : 'bg-teal-600 dark:bg-teal-500 text-white hover:bg-teal-700 dark:hover:bg-teal-600'
                    }`}
                    disabled={plan.isCurrent}
                  >
                    {plan.badge}
                  </button>
                </div>

                {/* Divider */}
                <div className='p-4'>
                        <div className="border-t border-gray-200 dark:border-gray-700 mb-4"></div>
                        {/* Price */}
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${plan.price}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400"> / month</span>
                        </div>
                        {/* Description */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {plan.description}
                        </p>
                        {/* Divider */}
                        <div className="border-t border-gray-200 dark:border-gray-700 mb-4"></div>
                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="shrink-0 w-5 h-5 border-2 border-[#009688] dark:border-teal-400 rounded-full  flex items-center justify-center">
                                <FaCheck className="w-3 h-3  text-teal-600 dark:text-teal-400"  />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* Plans */}
      
      </div>
    </div>
  );
}
