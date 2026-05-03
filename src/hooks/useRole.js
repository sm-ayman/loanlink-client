import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useRole = () => {
    const { getEffectiveUser, loading } = useContext(AuthContext);
    
    const effectiveUser = getEffectiveUser();
    const role = effectiveUser?.role || 'borrower';

    const isRoleLoading = loading;

    return [role, isRoleLoading];
};

export default useRole;
