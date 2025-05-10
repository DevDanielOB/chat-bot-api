import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('messages')
@Index(['de', 'para'])
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    de: number;

    @Column()
    @Index()
    para: number;

    @Column({ type: 'text' })
    texto: string;

    @CreateDateColumn()
    createdAt: Date;
}
