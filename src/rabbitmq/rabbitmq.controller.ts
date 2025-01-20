import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RabbitmqService } from './rabbitmq.service';
import { CreateRabbitmqDto } from './dto/create-rabbitmq.dto';
import { UpdateRabbitmqDto } from './dto/update-rabbitmq.dto';

@Controller()
export class RabbitmqController {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  @MessagePattern('createRabbitmq')
  create(@Payload() createRabbitmqDto: CreateRabbitmqDto) {
    return this.rabbitmqService.create(createRabbitmqDto);
  }

  @MessagePattern('findAllRabbitmq')
  findAll() {
    return this.rabbitmqService.findAll();
  }

  @MessagePattern('findOneRabbitmq')
  findOne(@Payload() id: number) {
    return this.rabbitmqService.findOne(id);
  }

  @MessagePattern('updateRabbitmq')
  update(@Payload() updateRabbitmqDto: UpdateRabbitmqDto) {
    return this.rabbitmqService.update(updateRabbitmqDto.id, updateRabbitmqDto);
  }

  @MessagePattern('removeRabbitmq')
  remove(@Payload() id: number) {
    return this.rabbitmqService.remove(id);
  }
}
