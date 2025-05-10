import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('users')
@Index('IDX_USER_NOME', ['nome'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @CreateDateColumn()
  createdAt: Date;
}
