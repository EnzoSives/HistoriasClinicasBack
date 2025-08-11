import { Injectable } from '@nestjs/common';
import { CreateImagenDto } from './dto/create-imagen.dto';
import { UpdateImagenDto } from './dto/update-imagen.dto';

@Injectable()
export class ImagenService {
  create(createImagenDto: CreateImagenDto) {
    return 'This action adds a new imagen';
  }

  findAll() {
    return `This action returns all imagen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imagen`;
  }

  update(id: number, updateImagenDto: UpdateImagenDto) {
    return `This action updates a #${id} imagen`;
  }

  remove(id: number) {
    return `This action removes a #${id} imagen`;
  }
}
