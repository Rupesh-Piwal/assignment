import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Role {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;
}

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field(() => Role)
    role: Role;
}
