export const PERMISSIONS = {
    DEVICE_VIEW: "device:view",
    DEVICE_CREATE: "device:create",
    DEVICE_UPDATE: "device:update",
    DEVICE_DELETE: "device:delete",

    USER_VIEW: "user:view",
    USER_CREATE: "user:create",
    USER_UPDATE: "user:update",
    USER_DELETE: "user:delete",
};

export const ROLE_PERMISSIONS = {

    Guest: [
        PERMISSIONS.DEVICE_VIEW,
        PERMISSIONS.USER_VIEW,
    ],

    Admin: [
        PERMISSIONS.DEVICE_VIEW,
        PERMISSIONS.DEVICE_CREATE,
        PERMISSIONS.DEVICE_UPDATE,
        PERMISSIONS.DEVICE_DELETE,

        PERMISSIONS.USER_VIEW,
        PERMISSIONS.USER_CREATE,
        PERMISSIONS.USER_UPDATE,
    ],

    Owner: [
        PERMISSIONS.DEVICE_VIEW,
        PERMISSIONS.DEVICE_CREATE,
        PERMISSIONS.DEVICE_UPDATE,
        PERMISSIONS.DEVICE_DELETE,

        PERMISSIONS.USER_VIEW,
        PERMISSIONS.USER_CREATE,
        PERMISSIONS.USER_UPDATE,
        PERMISSIONS.USER_DELETE,
    ],

    Member: [
        PERMISSIONS.DEVICE_VIEW,
        PERMISSIONS.DEVICE_UPDATE,
    ]

};

export const hasPermission = (role, permission) => {

    const permissions = ROLE_PERMISSIONS[role] || [];

    return permissions.includes(permission);
};