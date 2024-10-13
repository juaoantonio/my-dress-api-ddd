import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CONFIG_SCHEMA_TYPE } from "@nest/config-module/config.module";

export type CommonUser = {
  userId: string;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users: CommonUser[];

  constructor(
    private readonly configService: ConfigService<CONFIG_SCHEMA_TYPE>,
  ) {
    this.users = this.configService.get("USERS");
  }

  async findOne(username: string): Promise<CommonUser | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
