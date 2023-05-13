import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('score')
export class ScoreEntity {
    @PrimaryGeneratedColumn('increment')
    
}
