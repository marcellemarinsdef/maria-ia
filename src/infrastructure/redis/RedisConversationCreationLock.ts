import { randomUUID } from "crypto";
import type { RedisClientType } from "redis";

import { ConversationCreationLock } from "../../domain/ports/ConversationCreationLock.js";

export class RedisConversationCreationLock
  implements ConversationCreationLock
{
  constructor(
    private readonly redis: RedisClientType,
  ) {}

  async adquirir(idPessoa: string, ttlSeconds: number): Promise<string | null> {

    const key = `conversation:create:${idPessoa}`;
    const token = randomUUID();

    const resultado = await this.redis.set(
      key,
      token,
      {
        NX: true,
        EX: ttlSeconds,
      },
    );

    if (resultado !== "OK") {
      return null;
    }

    return token;
  }

  async liberar(
    idPessoa: string,
    token: string,
  ): Promise<void> {

    const key = `conversation:create:${idPessoa}`;

    await this.redis.eval(
      `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        end
        return 0
      `,
      {
        keys: [key],
        arguments: [token],
      },
    );
  }
}