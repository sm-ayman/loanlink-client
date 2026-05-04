import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useRole = () => {
    const { getEffectiveUser, loading } = useContext(AuthContext);
    
    const effectiveUser = getEffectiveUser();
    
    // If still loading and no user yet, role is undefined/null
    if (loading && !effectiveUser) {
        return [null, true];
    }

    const role = effectiveUser?.role || 'borrower';
    const isRoleLoading = loading;

    return [role, isRoleLoading];
};

export default useRole;
