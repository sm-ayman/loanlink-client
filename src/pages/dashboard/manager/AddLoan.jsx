import { useForm } from "react-hook-form";
import { useState } from "react";
import { loanAPI } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { uploadImage } from "../../../utils/imageUpload";

const AddLoan = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            
            let imageUrls = [];
            
            // Upload images to ImgBB if files are selected
            if (data.image && data.image.length > 0) {
                toast.loading(`Uploading ${data.image.length} image(s)...`, { id: 'upload' });
                for (let i = 0; i < data.image.length; i++) {
                    const url = await uploadImage(data.image[i]);
                    imageUrls.push(url);
                }
                toast.success('Images uploaded', { id: 'upload' });
            }

            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('category', data.category.toLowerCase());
            formData.append('interestRate', parseFloat(data.interestRate));
            formData.append('maxLoanLimit', parseFloat(data.maxAmount));
            formData.append('description', data.description);
            formData.append('showOnHome', data.showOnHome === 'true' || data.showOnHome === true);
            
            // Send images as an array in FormData
            imageUrls.forEach(url => {
                formData.append('images', url);
            });

            // Default requirements and plans
            formData.append('requiredDocuments[]', "Valid ID");
            formData.append('requiredDocuments[]', "Proof of Income");
            formData.append('requiredDocuments[]', "Proof of Address");
            formData.append('emiPlans[]', "3 Months");
            formData.append('emiPlans[]', "6 Months");
            formData.append('emiPlans[]', "12 Months");

            const response = await loanAPI.createLoan(formData);
            
            if (response.success) {
                toast.success("Loan Added Successfully!");
                reset();
                navigate('/dashboard/manage-loans');
            }
        } catch (error) {
            console.error("Failed to add loan:", error);
            const errorMsg = error.response?.data?.errors 
                ? error.response.data.errors.map(e => e.message).join(' | ')
                : error.response?.data?.message || "Failed to add loan";
            toast.error(errorMsg, { id: 'upload' });
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-center">
                        <div className="form-control w-fit">
                            <label className="cursor-pointer label justify-start gap-4">
                                <span className="label-text font-semibold">Show on Home Page?</span> 
                                <input type="checkbox" className="toggle toggle-primary" {...register("showOnHome")} value="true" />
                            </label>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Upload Loan Images (Optional)</span>
                            </label>
                            <input 
                                type="file" 
                                multiple
                                className="file-input file-input-bordered w-full" 
                                accept="image/*"
                                {...register("image")} 
                            />
                        </div>
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
