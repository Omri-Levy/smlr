import {
	BaseEntity,
	Column,
	Entity,
	Index,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Link extends BaseEntity {
	@PrimaryGeneratedColumn(`uuid`)
	id: string;

	@Column({ nullable: false })
	@Index(`long_url_idx`)
	longUrl: string;

	@Column({ length: 11, unique: true, nullable: false })
	@Index(`slug_idx`)
	slug: string;
}
