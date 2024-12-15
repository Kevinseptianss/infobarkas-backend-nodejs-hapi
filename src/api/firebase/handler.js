const admin = require("firebase-admin");
const AuthenticationError = require("../../exceptions/AuthenticationError");

class FirebaseHandler {
  constructor(service, validator, tokenManager, userService) {
    this._service = service;
    this._validator = validator;
    this._userService = userService;
    this.tokenManager = tokenManager;

    admin.initializeApp({
      credential: admin.credential.cert(require("./firebase.json")),
    });

    this.postAuthHandler = this.postAuthHandler.bind(this);
  }

  // Function to generate a random password
  generateRandomPassword(length = 12) {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  async postAuthHandler(request, h) {
    // Validate the request payload
    try {
      this._validator.validatePostFirebasePayload(request.payload);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return h.response({
        status: "fail",
        message: "Invalid request payload.",
      }).code(400);
    }
  
    const { idToken } = request.payload;
    const firebaseUser  = await this.validateFirebaseToken(idToken);
    if (!firebaseUser ) {
      return h.response(AuthenticationError("Harap login ulang")).code(401);
    }
    
    // Check if the user already exists
    const userExists = await this._userService.checkEmail(firebaseUser .email);
    if (!userExists) {
      const user = {
        id: firebaseUser.uid,
        email: firebaseUser .email,
        name: firebaseUser .name || "Unknown", // Use displayName if available
        password: this.generateRandomPassword(16), // Generate a random password
        location: "Tidak Diketahui",
      };
      try {
        await this._userService.addUserAuth (user);
      } catch (error) {
        console.error("Error adding user:", error);
        return h.response({
          status: "fail",
          message: "Failed to add user.",
        }).code(500);
      }
    }
    
    const id = firebaseUser .uid;
    const accessToken = this.tokenManager.generateAccessToken({ id });
    const refreshToken = this.tokenManager.generateRefreshToken({ id });
  
    await this._service.addRefreshToken(refreshToken);
    const response = h.response({
      status: "success",
      message: "Authentication berhasil di tambahkan",
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async validateFirebaseToken(idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error("Error verifying Firebase token:", error);
      return null; // Consider throwing an error or returning a specific response
    }
  }
}

module.exports = FirebaseHandler;
