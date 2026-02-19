import { Link, useRouteError } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const ErrorPage = () => {
    const error = useRouteError();
    
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 text-center p-4">
            <h1 className="text-9xl font-bold text-primary">
                {error?.status || 'Error'}
            </h1>
            <h2 className="text-3xl font-semibold mt-4">
                {error?.status === 404 ? 'Page Not Found' : 'Something Went Wrong'}
            </h2>
            <p className="py-4 text-lg max-w-md text-error">
                <i>{error?.statusText || error?.message || "An unexpected error occurred."}</i>
            </p>
            <Link to="/" className="btn btn-primary gap-2">
                <FaHome /> Back to Home
            </Link>
        </div>
    );
};

export default ErrorPage;
