import {IsEmail,IsNotEmpty} from 'class-validator';

export class CreateReviewDto {
    @IsEmail()
    email:string

    @IsNotEmpty()
        content:string
}
