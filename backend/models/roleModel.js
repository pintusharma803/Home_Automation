const mongoose = require("mongoose");

// const { Schema } = mongoose;

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        // description: {
        //   type: String,
        //   trim: true,
        //   maxlength: 255,
        //   default: "",
        // },

        permissions: {
            canView: Boolean,
            canControl: Boolean,
            canEdit: Boolean,
            canDelete: Boolean,
        },

        isSystem: {
            type: Boolean,
            default: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

/**
 * Indexes
 */
roleSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Role", roleSchema);