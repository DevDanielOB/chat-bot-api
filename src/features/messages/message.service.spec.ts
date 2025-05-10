import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from './models/message.entity';
import { EventsGateway } from '../../infra/websocket/events.gateway';
import { CreateMessageDto } from './dtos/crete-message.dto';

describe('MessageService', () => {
    let service: MessageService;
    let messageRepository: Repository<Message>;
    let eventsGateway: EventsGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MessageService,
                {
                    provide: getRepositoryToken(Message),
                    useClass: Repository,
                },
                {
                    provide: EventsGateway,
                    useValue: {
                        sendMessageToUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<MessageService>(MessageService);
        messageRepository = module.get<Repository<Message>>(getRepositoryToken(Message));
        eventsGateway = module.get<EventsGateway>(EventsGateway);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createMessage', () => {
        it('should create and save a message, then notify via WebSocket', async () => {
            const createMessageDto: CreateMessageDto = {
                de: 1,
                para: 2,
                texto: 'Hello',
            };

            const savedMessage = {
                id: 1,
                de: 1,
                para: 2,
                texto: 'Hello',
                createdAt: new Date(),
            };

            jest.spyOn(messageRepository, 'create').mockReturnValue(savedMessage as any);
            jest.spyOn(messageRepository, 'save').mockResolvedValue(savedMessage);

            const result = await service.createMessage(createMessageDto);

            expect(messageRepository.create).toHaveBeenCalledWith(createMessageDto);
            expect(messageRepository.save).toHaveBeenCalledWith(savedMessage);
            expect(eventsGateway.sendMessageToUser).toHaveBeenCalledWith(2, {
                de: 1,
                texto: 'Hello',
                id: savedMessage.id,
                createdAt: savedMessage.createdAt,
            });
            expect(result).toEqual(savedMessage);
        });
    });

    describe('getConversation', () => {
        it('should return a conversation between two users', async () => {
            const messages = [
                { id: 1, de: 1, para: 2, texto: 'Hi', createdAt: new Date() },
                { id: 2, de: 2, para: 1, texto: 'Hello', createdAt: new Date() },
            ];

            jest.spyOn(messageRepository, 'find').mockResolvedValue(messages as any);

            const result = await service.getConversation(1, 2);

            expect(messageRepository.find).toHaveBeenCalledWith({
                where: [
                    { de: 1, para: 2 },
                    { de: 2, para: 1 },
                ],
                order: { createdAt: 'ASC' },
            });
            expect(result).toEqual(messages);
        });
    });

    describe('listContacts', () => {
        it('should return a list of unique contact IDs for a user', async () => {
            const messages = [
                { id: 1, de: 1, para: 2, texto: 'Hi', createdAt: new Date() },
                { id: 2, de: 2, para: 1, texto: 'Hello', createdAt: new Date() },
                { id: 3, de: 1, para: 3, texto: 'Hey', createdAt: new Date() },
            ];

            jest.spyOn(messageRepository, 'find').mockResolvedValue(messages as any);

            const result = await service.listContacts(1);

            expect(messageRepository.find).toHaveBeenCalledWith({
                where: [
                    { de: 1 },
                    { para: 1 },
                ],
                relations: [],
            });
            expect(result).toEqual([2, 3]);
        });
    });
});