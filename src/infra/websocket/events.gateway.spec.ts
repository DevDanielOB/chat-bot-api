import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

describe('EventsGateway', () => {
    let gateway: EventsGateway;
    let mockServer: jest.Mocked<Server>;
    let mockLogger: jest.Mocked<Logger>;

    beforeEach(async () => {
        mockServer = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
        } as unknown as jest.Mocked<Server>;

        mockLogger = {
            log: jest.fn(),
            warn: jest.fn(),
        } as unknown as jest.Mocked<Logger>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsGateway,
                { provide: Logger, useValue: mockLogger },
            ],
        }).compile();

        gateway = module.get<EventsGateway>(EventsGateway);
        gateway.server = mockServer;
    });

    describe('handleConnection', () => {
        it('should add a user to connectedUsers and log the connection', () => {
            const mockClient = {
                handshake: { query: { userId: '1' } },
                id: 'socket1',
                disconnect: jest.fn(),
            } as unknown as Socket;

            gateway.handleConnection(mockClient);

            expect(gateway['connectedUsers'].get(1)).toBe('socket1');
        });

        it('should disconnect the client if userId is not provided', () => {
            const mockClient = {
                handshake: { query: {} },
                disconnect: jest.fn(),
            } as unknown as Socket;

            gateway.handleConnection(mockClient);

            expect(mockClient.disconnect).toHaveBeenCalled();
        });
    });

    describe('handleDisconnect', () => {
        it('should remove a user from connectedUsers and log the disconnection', () => {
            gateway['connectedUsers'].set(1, 'socket1');

            const mockClient = {
                id: 'socket1',
            } as unknown as Socket;

            gateway.handleDisconnect(mockClient);

            expect(gateway['connectedUsers'].has(1)).toBe(false);
        });

        it('should do nothing if the client is not in connectedUsers', () => {
            const mockClient = {
                id: 'unknownSocket',
            } as unknown as Socket;

            gateway.handleDisconnect(mockClient);

            expect(mockLogger.log).not.toHaveBeenCalled();
        });
    });

    describe('sendMessageToUser', () => {
        it('should send a message to the user if they are connected', () => {
            gateway['connectedUsers'].set(1, 'socket1');

            gateway.sendMessageToUser(1, { text: 'Hello' });

            expect(mockServer.to).toHaveBeenCalledWith('socket1');
            expect(mockServer.emit).toHaveBeenCalledWith('new-message', { text: 'Hello' });
        });
    });
});