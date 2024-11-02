const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
//     console.log("JWT_SECRET in authmiddleware", process.env.JWT_SECRET); // This should print HRZHEALTHY

//   try {
//     const token = req.headers["authorization"].split(" ")[1];
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).send({
//           message: "Auth failed",
//           success: false,
//         });
//       } else {
//         req.body.userId = decoded.id;
//         console.log("req.body.userId in authmiddleware is",req.body.userId);
        
//         next();
//       }
//     });
//   } catch (error) {
//     return res.status(401).send({
//       message: "Auth failed",
//       success: false,
//     });
//   }





// const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ message: "Authorization required" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");
//     if (!req.user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }


try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization required", success: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Auth failed", success: false });
      } else {
        req.user = { id: decoded.id }; // Set req.user with the decoded id
        console.log("Decoded user ID:", req.user.id); // Log for debugging
        next();
      }
    });
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res.status(500).json({ message: "Auth failed", success: false });
  }

};
