import { ApiProperty } from "@nestjs/swagger";

import { Exclude } from "class-transformer";

import Feature from "../models/feature.model";

export class FeatureInfo implements Partial<Omit<Feature, "company">> {
	@ApiProperty({ description: "feature's name" })
	feature: string;

	@ApiProperty({ description: "active" })
	active: boolean;

	@Exclude()
	@ApiProperty()
	id: number;

	@Exclude()
	@ApiProperty()
	companyId: number;

	@Exclude()
	@ApiProperty()
	updatedAt?: Date;

	@Exclude()
	@ApiProperty()
	createdAt?: Date;

	constructor(data: Feature) {
		Object.assign(this, data.dataValues ? data.toJSON() : data);
	}
}
