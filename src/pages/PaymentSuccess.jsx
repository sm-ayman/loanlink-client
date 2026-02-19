import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaCheckCircle, FaCreditCard, FaHome, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      // In a real implementation, you would verify the payment with your backend
      // For now, we'll simulate success
      setTimeout(() => {
        setPaymentDetails({
          amount: "$10.00",
          transactionId: sessionId.slice(-12),
          email: "user@example.com", // Would come from backend
          date: new Date().toLocaleDateString(),
          status: "Success"
        });
        setLoading(false);
        toast.success("Payment completed successfully!");
      }, 2000);
    } else {
      setLoading(false);
      toast.error("Invalid payment session");
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-success text-white p-8 text-center">
            <FaCheckCircle className="mx-auto text-6xl mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-success-content/80">Your application fee has been processed successfully</p>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            <div className="bg-base-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaCreditCard className="text-primary" />
                Payment Details
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-success">{paymentDetails?.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">{paymentDetails?.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span>{paymentDetails?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-success font-semibold">Completed</span>
                </div>
              </div>
            </div>

            <div className="alert alert-success mb-6">
              <FaCheckCircle />
              <div>
                <h3 className="font-bold">Application Processing Started</h3>
                <p>Your loan application is now being processed. You will receive updates via email.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard/my-loans" className="btn btn-primary flex-1">
                <FaUser className="mr-2" />
                View My Applications
              </Link>
              <Link to="/" className="btn btn-outline flex-1">
                <FaHome className="mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-base-100 rounded-lg p-6 shadow">
          <h3 className="font-bold mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Your application will be reviewed by our loan officers
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              You will receive an email notification with the decision
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              If approved, funds will be disbursed to your account
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;