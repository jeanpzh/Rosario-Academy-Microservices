import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name)

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_API_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
  }

  async uploadAvatar(file: any): Promise<string> {
    try {
      this.logger.log('Uploading avatar to Cloudinary')

      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'avatars',
              resource_type: 'image',
              transformation: [
                { width: 500, height: 500, crop: 'fill', gravity: 'face' },
                { quality: 'auto:good' }
              ]
            },
            (error, result) => {
              if (error) {
                this.logger.error(`Cloudinary upload error: ${error.message}`)
                reject(error)
              } else {
                resolve(result as UploadApiResponse)
              }
            }
          )
          .end(file.buffer)
      })

      this.logger.log(`Avatar uploaded successfully: ${result.secure_url}`)
      return result.secure_url
    } catch (error) {
      this.logger.error(`Error uploading avatar: ${error.message}`)
      throw new BadRequestException('Error al subir la imagen')
    }
  }
}
