import { useForm } from "react-hook-form";
import { useState } from "react";
import { loanAPI } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddLoan = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            
            // Format data to match backend schema expectations
            const loanData = {
                title: data.title,
                category: data.category.toLowerCase(), // Backend expects lowercase enum
                interestRate: parseFloat(data.interestRate),
                maxLoanLimit: parseFloat(data.maxAmount), // Backend expects maxLoanLimit, not maxAmount
                description: data.description,
                images: ["https://via.placeholder.com/600x400?text=" + encodeURIComponent(data.title)], // Placeholder image
                showOnHome: data.showOnHome === 'true',
                // Optional fields with defaults
                requiredDocuments: ["Valid ID", "Proof of Income", "Proof of Address"],
                emiPlans: ["3 Months", "6 Months", "12 Months"]
            };

            const response = await loanAPI.createLoan(loanData);
            
            if (response.success) {
                toast.success("Loan Added Successfully!");
                reset();
                navigate('/dashboard/manage-loans');
            }
        } catch (error) {
            console.error("Failed to add loan:", error);
            toast.error(error.response?.data?.message || "Failed to add loan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6">Add New Loan</h2>
            
            <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Loan Title</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. Personal Loan" 
                                className="input input-bordered w-full" 
                                {...register("title", { required: "Title is required" })}
                            />
                            {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <select className="select select-bordered w-full" {...register("category", { required: true })}>
                                <option value="Personal">Personal</option>
                                <option value="Business">Business</option>
                                <option value="Education">Education</option>
                                <option value="Home">Home</option>
                                <option value="Vehicle">Vehicle</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Interest Rate (%)</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. 5%" 
                                className="input input-bordered w-full" 
                                {...register("interestRate", { required: "Interest rate is required" })}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Max Loan Amount</span>
                            </label>
                            <input 
                                type="number" 
                                placeholder="e.g. 50000" 
                                className="input input-bordered w-full" 
                                {...register("maxAmount", { required: "Max amount is required" })}
                            />
                        </div>
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea 
                            className="textarea textarea-bordered h-24" 
                            placeholder="Loan details..."
                            {...register("description", { required: "Description is required" })}
                        ></textarea>
                    </div>
                    
                    <div className="form-control mt-4 w-fit">
                        <label className="cursor-pointer label justify-start gap-4">
                            <span className="label-text">Show on Home Page?</span> 
                            <input type="checkbox" className="toggle toggle-primary" {...register("showOnHome")} value="true" />
                        </label>
                    </div>

                    <div className="form-control mt-6">
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <><span className="loading loading-spinner"></span> Adding...</>
                            ) : "Add Loan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLoan;
