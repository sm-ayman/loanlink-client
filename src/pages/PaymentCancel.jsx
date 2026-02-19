import { Link } from "react-router-dom";
import { FaTimesCircle, FaCreditCard, FaHome, FaUser, FaRedo } from "react-icons/fa";
import toast from "react-hot-toast";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
          {/* Cancel Header */}
          <div className="bg-warning text-white p-8 text-center">
            <FaTimesCircle className="mx-auto text-6xl mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
            <p className="text-warning-content/80">Your payment was not completed</p>
          </div>

          {/* Cancel Details */}
          <div className="p-8">
            <div className="bg-base-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaCreditCard className="text-warning" />
                Payment Status
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-semibold text-warning">Cancelled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Application Fee:</span>
                  <span>$10.00</span>
                </div>
              </div>
            </div>

            <div className="alert alert-warning mb-6">
              <FaTimesCircle />
              <div>
                <h3 className="font-bold">Payment Not Completed</h3>
                <p>Your loan application fee was not processed. You can try again anytime.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard/my-loans" className="btn btn-primary flex-1">
                <FaUser className="mr-2" />
                View My Applications
              </Link>
              <button
                onClick={() => window.history.back()}
                className="btn btn-outline flex-1"
              >
                <FaRedo className="mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>

        {/* Help Info */}
        <div className="mt-6 bg-base-100 rounded-lg p-6 shadow">
          <h3 className="font-bold mb-3">Need Help?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Contact our support team if you encountered any issues
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              You can retry the payment from your dashboard anytime
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              The application fee is $10 and is required to process your loan
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;