import {useAuth} from '../context/AuthContext';
import {hasPermission} from '../config/permissions';

export const usePermission = () => {
    const {user} = useAuth();
    const can = (permission) => {
        if(!user || !user.role) return false;
        return hasPermission(
            user.role, 
            permission
        ); 
    }
    return {can:can};
};