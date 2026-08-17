const Role = require("../models/roleModel");
async function seedRoles() {
    const roles = [
        {
            name: "Owner",
            permissions: {
                canView: true,
                canControl: true,
                canEdit: true,
                canDelete: true,
            },
        },
        
        {
            name: "Admin",
            permissions: {
                canView: true,
                canControl: true,
                canEdit: true,
                canDelete: true,
            },
        },

        {
            name: "Member",
            permissions: {
                canView: true,
                canControl: true,
                canEdit: false,
                canDelete: false,
            },
        },
        {
            name: "Guest",
            permissions: {
                canView: true,
                canControl: false,
                canEdit: false,
                canDelete: false,
            },
        },

    ];

try{
    for(const role of roles){
        const existingRole = await Role.findOne({name: role.name});
        if(!existingRole){
            await Role.create(role);
            console.log(`Role ${role.name} created successfully`);
        }else{
            console.log(`Role ${role.name} already exists`);
        }
    }

}catch (error) {
    console.error("Error occurred while seeding roles:", error);
}
}

module.exports = seedRoles;