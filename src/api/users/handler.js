const InvariantError = require("../../exceptions/InvariantError");
const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postRegisterUserHandler = this.postRegisterUserHandler.bind(this);
    this.getUserInfoHandler = this.getUserInfoHandler.bind(this);
    this.postProfilePictureHandler = this.postProfilePictureHandler.bind(this);
    this.putUserInfoHandler = this.putUserInfoHandler.bind(this);
  }

  async postRegisterUserHandler(request, h) {
    try {
      this._validator.validateUserPayLoad(request.payload);
      const { email, password, name, location } = request.payload;

      const userId = await this._service.addUser({
        email,
        password,
        name,
        location,
      });

      const response = h.response({
        status: "success",
        message: "User berhasil di tambahkan",
        data: {
          userId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      console.error(error); // Log the error for debugging

      // Handle validation errors or other errors
      if (error instanceof InvariantError) {
        // Assuming InvariantError is used for validation
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(400); // Return 400 Bad Request for validation errors
      }

      // Handle other types of errors
      return h
        .response({
          status: "error",
          message: "Internal Server Error",
        })
        .code(500); // Return 500 for server errors
    }
  }

  async getUserInfoHandler(request, h) {
    const userId = request.auth.credentials.id;
    const user = await this._service.getUserProfile(userId);

    return {
      status: "success",
      data: {
        user,
      },
    };
  }

  async putUserInfoHandler(request, h) {
    try {
      this._validator.validateEditUserPayLoad(request.payload);
      const userId = request.auth.credentials.id;
      const { name, phone } = request.payload;
      const result = await this._service.putUserProfile(userId, name, phone);

      const response = h.response({
        status: "success",
        message: "User berhasil di ubah",
        data: {
          result,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      console.error(error); // Log the error for debugging

      // Handle validation errors or other errors
      if (error instanceof InvariantError) {
        // Assuming InvariantError is used for validation
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(400); // Return 400 Bad Request for validation errors
      }

      // Handle other types of errors
      return h
        .response({
          status: "error",
          message: "Internal Server Error",
        })
        .code(500); // Return 500 for server errors
    }
  }

  async postProfilePictureHandler(request, h) {
    try {
      const userId = request.auth.credentials.id;
      const checkPP = await this._service.checkPP(userId);

      if (checkPP) {
        const filePath = path.join(__dirname, "uploads", checkPP);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          await this._service.deletePP(userId);
        } else {
          return h.response({ message: "File not found" }).code(404);
        }
      }

      // Check if a file is uploaded
      const file = request.payload.file; // Assuming the file is sent with the key 'file'

      if (!file) {
        return h.response({ error: "No file uploaded" }).code(400);
      }

      // Generate a unique filename using nanoid
      const uniqueFileName = `${nanoid(32)}${path.extname(file.hapi.filename)}`;
      const uploadPath = path.join(__dirname, "uploads", uniqueFileName);

      // Move the file to the uploads directory
      const fileStream = fs.createWriteStream(uploadPath);
      file.pipe(fileStream);

      return new Promise((resolve, reject) => {
        fileStream.on("finish", async () => {
          await this._service.addProfilePicture(userId, uniqueFileName);
        });

        fileStream.on("error", (error) => {
          reject(h.response({ error: "Failed to upload file" }).code(500));
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserHandler;
