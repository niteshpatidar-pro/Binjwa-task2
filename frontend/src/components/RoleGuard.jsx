import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * A wrapper component that conditionally renders its children based on
 * the user's roles or permissions.
 *
 * @param {Array<string>} allowedRoles - Roles that can see this (e.g., ['Admin', 'Analyst'])
 * @param {string} requiredPermission - Permission string (e.g., 'user:manage')
 */
const RoleGuard = ({ children, allowedRoles, requiredPermission, fallback = null }) => {
    const { user } = useAuth();

    if (!user) {
        return fallback;
    }

    // Check superadmin override
    if (user.role === 'Admin') {
        return <>{children}</>;
    }

    let hasAccess = false;

    // Check Role
    if (allowedRoles && allowedRoles.length > 0) {
        if (allowedRoles.includes(user.role)) {
            hasAccess = true;
        }
    }

    // In a fully robust frontend, you'd load user's permissions array into Context
    // and check: if (requiredPermission && user.permissionList.includes(requiredPermission)) { hasAccess = true; }
    // For now, if no requiredPermission or roles are provided, default to rejecting access unless matched above.
    
    // Example logic if permissions were loaded:
    // if (!hasAccess && requiredPermission && user.permissions?.includes(requiredPermission)) {
    //     hasAccess = true;
    // }

    return hasAccess ? <>{children}</> : fallback;
};

export default RoleGuard;
