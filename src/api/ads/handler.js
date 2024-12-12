const InvariantError = require("../../exceptions/InvariantError");
const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

class AdsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAdsHandler = this.postAdsHandler.bind(this);
    this.getAdsByIdHandler = this.getAdsByIdHandler.bind(this);
    this.getAdsHandler = this.getAdsHandler.bind(this);
    this.getMyAdsHandler = this.getMyAdsHandler.bind(this);
    this.putAdsHandler = this.putAdsHandler.bind(this);
    this.deleteAdsHandler = this.deleteAdsHandler.bind(this);
    this.getAdsSearchHandler = this.getAdsSearchHandler.bind(this);  
  }

  async postAdsHandler(request, h) {
    try {
      this._validator.validateAdsPayload(request.payload);
      console.log(request.payload);
      const { title, price, description, category } = JSON.parse(request.payload.data);
      const userId = request.auth.credentials.id;

      const images = request.payload.images;

      const uploadsDir = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

      const fileNames = [];
      for (const file of images) {
        // Generate a unique ID using nanoid
        const uniqueId = `img-${nanoid(32)}`;

        // Get the original file extension
        const ext = path.extname(file.hapi.filename);

        // Create a new unique filename
        const uniqueFileName = `${uniqueId}${ext}`;

        // Construct the file path
        const filePath = path.join(uploadsDir, uniqueFileName);

        // Create a write stream and pipe the file
        const fileStream = fs.createWriteStream(filePath);
        file.pipe(fileStream);

        // Log when the upload is finished
        fileStream.on("finish", () => {
          console.log(`Uploaded: ${uniqueFileName}`);
        });

        // Store the unique filename
        fileNames.push(uniqueFileName);
      }

      const adsId = await this._service.addAds({
        userId,
        title,
        price,
        description,
        fileNames,
        category,
      });

      const response = h.response({
        status: "success",
        message: "Iklan berhasil di tambahkan",
        data: {
          adsId,
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

  async putAdsHandler(request, h) {
    try {
      this._validator.validateAdsPayload(request.payload);
      const { id, title, price, description, category, oldimages } = JSON.parse(request.payload.data);
      const userId = request.auth.credentials.id;

      const adsId = await this._service.putAds({
        id,
        userId,
        title,
        price,
        description,
        category,
      });

      const response = h.response({
        status: "success",
        message: "Iklan berhasil di tambahkan",
        data: {
          adsId,
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

  async deleteAdsHandler(request, h) {
    try {
      const { id } = request.params;
      const userId = request.auth.credentials.id;

      const adsId = await this._service.deleteAds({ id, userId });

      const response = h.response({
        status: "success",
        message: "Iklan berhasil di tambahkan",
        data: {
          adsId,
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
 
  async getAdsByIdHandler(request, h) {
    const { params } = request;

    if (!params || !params.id) {
      return h.response({
        status: "fail",
        message: "Missing ID parameter.",
      }).code(400);
    }
    const { id } = request.params;
    const ads = await this._service.getAdsById(id);
    const response = h.response({
      status: "success",
      data: {
        ads,
      },
    });
    response.code(201);
    return response;
  }

  async getAdsSearchHandler(request, h) {
    try {
      const { search } = request.query;
      const ads = await this._service.getAdsSearch(search);
      const response = h.response({
        status: "success",
        data: {
          ads,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
    }
    
  }

  async getAdsHandler(request, h) {
    const ads = await this._service.getAds();
    const response = h.response({
      status: "success",
      data: {
        ads,
      },
    });
    response.code(201);
    return response;
  }

  async getMyAdsHandler(request, h) {
    const userId = request.auth.credentials.id;
    const ads = await this._service.getMyAds(userId);
    const response = h.response({
      status: "success",
      data: {
        ads,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = AdsHandler;
