import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// import useAxiosSecure from "./useAxiosSecure";
// import { useQuery } from "@tanstack/react-query";

const useRole = () => {
    const { user, loading } = useContext(AuthContext);
    // const axiosSecure = useAxiosSecure();

    // TODO: Fetch role from database
    // const { data: role, isLoading: isRoleLoading } = useQuery({
    //     queryKey: [user?.email, 'role'],
    //     enabled: !loading && !!user?.email,
    //     queryFn: async () => {
    //         const res = await axiosSecure.get(`/users/role/${user.email}`);
    //         return res.data?.role;
    //     }
    // })
    
    // MOCK ROLE FOR DEVELOPMENT
    // Determine role based on email for testing
    let role = 'borrower';
    if(user?.email === 'superadmin@loanlink.com') role = 'super-admin';
    else if(user?.email === 'admin@loanlink.com') role = 'admin';
    else if(user?.email === 'manager@loanlink.com') role = 'manager';
    // Default to admin for other users during dev if needed, or keep as borrower
    // role = 'admin'; 

    const isRoleLoading = loading;

    return [role, isRoleLoading];
};

export default useRole;
