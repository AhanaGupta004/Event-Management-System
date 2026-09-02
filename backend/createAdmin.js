const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const email = "admin@gmail.com";
        const password = "admin123";

        const hashedPassword = await bcrypt.hash(password, 10);

        let user = await User.findOne({ email });

        if (user) {
            user.password = hashedPassword;
            user.role = "admin";
            await user.save();

            console.log("Admin account updated successfully");
        } else {
            user = await User.create({
                name: "Admin",
                email: email,
                password: hashedPassword,
                phone: "",
                role: "admin"
            });

            console.log("Admin account created successfully");
        }

        console.log("--------------------------------");
        console.log("Admin Email:", email);
        console.log("Admin Password:", password);
        console.log("Role:", user.role);
        console.log("--------------------------------");

        process.exit(0);

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

createAdmin();