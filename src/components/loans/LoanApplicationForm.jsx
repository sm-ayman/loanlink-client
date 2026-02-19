import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

const LoanApplicationForm = ({ loan, isOpen, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      contactNumber: "",
      nationalId: "",
      incomeSource: "salary",
      monthlyIncome: "",
      loanAmount: "",
      reasonForLoan: "",
      address: "",
      extraNotes: ""
    }
  });

  const watchedLoanAmount = watch("loanAmount");

    const onSubmit = async (data) => {
        if (!loan || !user) return;

        // Validate loan amount doesn't exceed limit
        if (parseFloat(data.loanAmount) > loan.maxAmount) {
            toast.error(`Loan amount cannot exceed $${loan.maxAmount}`);
            return;
        }

        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            try {
                const applicationData = {
                    _id: Date.now().toString(),
                    loanId: loan,
                    userId: {
                        _id: user.uid || 'user123',
                        name: user.displayName || user.email?.split('@')[0] || 'User',
                        email: user.email
                    },
                    firstName: data.firstName,
                    lastName: data.lastName,
                    contactNumber: data.contactNumber,
                    nationalId: data.nationalId,
                    incomeSource: data.incomeSource,
                    monthlyIncome: parseFloat(data.monthlyIncome),
                    loanAmount: parseFloat(data.loanAmount),
                    reasonForLoan: data.reasonForLoan,
                    address: data.address,
                    extraNotes: data.extraNotes || "",
                    status: "pending",
                    applicationFeeStatus: "unpaid",
                    createdAt: new Date().toISOString()
                };

                toast.success("Loan application submitted successfully!");
                onSuccess && onSuccess(applicationData);
                onClose();
            } catch (error) {
                console.error("Application submission error:", error);
                toast.error("Failed to submit application");
            } finally {
                setLoading(false);
            }
        }, 1500);
    };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-primary">Apply for Loan</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Auto-filled fields */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-primary">Loan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  className="input input-bordered w-full bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Loan Title</span>
                </label>
                <input
                  type="text"
                  value={loan?.title || ""}
                  className="input input-bordered w-full bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Interest Rate</span>
                </label>
                <input
                  type="text"
                  value={`${loan?.interestRate || 0}%`}
                  className="input input-bordered w-full bg-gray-100"
                  readOnly
                />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              Maximum loan limit: <span className="font-semibold">${loan?.maxLoanLimit || 0}</span>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">First Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: { value: 2, message: "First name must be at least 2 characters" },
                    pattern: { value: /^[a-zA-Z\s]+$/, message: "First name can only contain letters and spaces" }
                  })}
                />
                {errors.firstName && <span className="text-error text-sm">{errors.firstName.message}</span>}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Last Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  className={`input input-bordered w-full ${errors.lastName ? 'input-error' : ''}`}
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: { value: 2, message: "Last name must be at least 2 characters" },
                    pattern: { value: /^[a-zA-Z\s]+$/, message: "Last name can only contain letters and spaces" }
                  })}
                />
                {errors.lastName && <span className="text-error text-sm">{errors.lastName.message}</span>}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Contact Number *</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter your contact number"
                  className={`input input-bordered w-full ${errors.contactNumber ? 'input-error' : ''}`}
                  {...register("contactNumber", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: "Please enter a valid contact number"
                    }
                  })}
                />
                {errors.contactNumber && <span className="text-error text-sm">{errors.contactNumber.message}</span>}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">National ID / Passport *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your national ID or passport number"
                  className={`input input-bordered w-full ${errors.nationalId ? 'input-error' : ''}`}
                  {...register("nationalId", {
                    required: "National ID or passport number is required"
                  })}
                />
                {errors.nationalId && <span className="text-error text-sm">{errors.nationalId.message}</span>}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Income Source *</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  {...register("incomeSource")}
                >
                  <option value="salary">Salary</option>
                  <option value="business">Business</option>
                  <option value="freelance">Freelance</option>
                  <option value="investment">Investment</option>
                  <option value="rental">Rental</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Monthly Income *</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter your monthly income"
                  className={`input input-bordered w-full ${errors.monthlyIncome ? 'input-error' : ''}`}
                  {...register("monthlyIncome", {
                    required: "Monthly income is required",
                    min: { value: 0, message: "Monthly income must be a positive number" }
                  })}
                />
                {errors.monthlyIncome && <span className="text-error text-sm">{errors.monthlyIncome.message}</span>}
              </div>
            </div>
          </div>

          {/* Loan Information */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">Loan Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Loan Amount *</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter desired loan amount"
                  className={`input input-bordered w-full ${errors.loanAmount ? 'input-error' : ''}`}
                  {...register("loanAmount", {
                    required: "Loan amount is required",
                    min: { value: 100, message: "Loan amount must be at least $100" },
                    max: {
                      value: loan?.maxAmount || 1000000,
                      message: `Loan amount cannot exceed $${loan?.maxAmount || 1000000}`
                    }
                  })}
                />
                {errors.loanAmount && <span className="text-error text-sm">{errors.loanAmount.message}</span>}
                {watchedLoanAmount && parseFloat(watchedLoanAmount) > (loan?.maxLoanLimit || 0) && (
                  <span className="text-error text-sm">Amount exceeds loan limit</span>
                )}
              </div>
              <div className="md:col-span-1">
                <label className="label">
                  <span className="label-text">Reason for Loan *</span>
                </label>
                <textarea
                  placeholder="Please explain why you need this loan"
                  className={`textarea textarea-bordered w-full h-20 ${errors.reasonForLoan ? 'textarea-error' : ''}`}
                  {...register("reasonForLoan", {
                    required: "Reason for loan is required",
                    minLength: { value: 10, message: "Please provide at least 10 characters" },
                    maxLength: { value: 500, message: "Reason cannot exceed 500 characters" }
                  })}
                />
                {errors.reasonForLoan && <span className="text-error text-sm">{errors.reasonForLoan.message}</span>}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="label">
              <span className="label-text">Address *</span>
            </label>
            <textarea
              placeholder="Enter your complete address"
              className={`textarea textarea-bordered w-full h-20 ${errors.address ? 'textarea-error' : ''}`}
              {...register("address", {
                required: "Address is required",
                minLength: { value: 10, message: "Please provide a complete address" },
                maxLength: { value: 200, message: "Address cannot exceed 200 characters" }
              })}
            />
            {errors.address && <span className="text-error text-sm">{errors.address.message}</span>}
          </div>

          {/* Extra Notes */}
          <div>
            <label className="label">
              <span className="label-text">Extra Notes</span>
            </label>
            <textarea
              placeholder="Any additional information you want to share (optional)"
              className="textarea textarea-bordered w-full h-20"
              {...register("extraNotes", {
                maxLength: { value: 500, message: "Extra notes cannot exceed 500 characters" }
              })}
            />
            {errors.extraNotes && <span className="text-error text-sm">{errors.extraNotes.message}</span>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !loan}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplicationForm;