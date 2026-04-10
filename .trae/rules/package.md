# 依赖安装
总是使用 bun 进行安装依赖，如：

```bash
cd apps/api
bun add nanoid
```  
禁止 MUST NOT 手写 package.json 中的包文件或版本号，只能使用 bun 进行安装依赖，避免版本过旧。

# 命令运行
请使用 gitbash 为默认终端，如果你使用的是 powershell，不要使用连接符 `&&`，使用独立的命令运行。

# TypeScript 接口/类型导入规则
## 必须：

接口和类型别名必须用 import type / export type
检查所有导入和导出链，一处遗漏都会报错
## 不能：

不能用普通 import / export 导入导出接口和类型
示例：

// ✅ 正确
import type { ImageAdapter } from "./interface.js";
export type { ImageAdapter } from "./interface.js";

// ❌ 错误 - 运行时会报 "export 'ImageAdapter' not found"
import { ImageAdapter } from "./interface.js";
export { ImageAdapter } from "./interface.js";
原因： 接口在编译后不存在，运行时找不到会报错。
