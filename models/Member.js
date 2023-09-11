const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class Member extends Model {
    validatePassword(inputPass) {
        return bcrypt.compareSync(inputPass, this.password);
    }
}

Member.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8],
                isUppercase(value) {
                    if (!/[A-Z]/.test(value)) {
                        throw new Error('Password must contain at least one uppercase letter.');
                    }
                },
                isLowercase(value) {
                    if (!/[a-z]/.test(value)) {
                        throw new Error('Password must contain at least one lowercase letter.');
                    }
                },
                isNumeric(value) {
                    if (!/[0-9]/.test(value)) {
                        throw new Error('Password must contain at least one number.');
                    }
                },
                hasSpecial(value) {
                    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) {
                        throw new Error('Password must contain at least one special character.');
                    }
                }
            },
        },
    },
    {
        hooks: {
            beforeCreate: async (incomingData) => {
                incomingData.password = await bcrypt.hash(incomingData.password, 10);
                return incomingData;
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'member',
    }
);

module.exports = Member;