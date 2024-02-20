import { IsNotEmpty } from "class-validator"

export class CreateCompanyDto {
    @IsNotEmpty({ message: "Vui lòng điền tên công ty" })
    name: string

    @IsNotEmpty({ message: "Vui lòng điền địa chỉ" })
    address: string

    @IsNotEmpty({ message: "Vui lòng điền mô tả" })
    description: string
}
