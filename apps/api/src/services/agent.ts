import { ToolLoopAgent } from "ai";
import { getTools } from "../tools";
import Model from "./model";

export default class Agent {
  private constructor() {} // 禁止外部 new

  /**
   * 获取 Agent 实例
   */
  static get(modelFull: string, userId?: string): ToolLoopAgent {
    // 获取（或创建）底层模型实例
    const modelInstance = Model.create(modelFull);

    // 创建并返回 Agent 实例
    return new ToolLoopAgent({
      model: modelInstance,
      tools: getTools(userId),
    });
  }
}
