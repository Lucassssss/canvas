import * as React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ActionNode({ id, data, isConnectable }: NodeProps) {
  const { updateNodeData } = useReactFlow();

  const handleActionChange = (value: string) => {
    updateNodeData(id, { actionType: value });
  };

  const handleFieldChange = (field: string, value: string) => {
    updateNodeData(id, { [field]: value });
  };

  const actionType = (data.actionType as string) || 'navigate';

  return (
    <div className="w-72 bg-card border border-border shadow-md rounded-md p-3 relative text-foreground">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      <div>
        <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
          <div className="bg-primary/20 p-1 rounded">
             <span className="text-primary text-xs font-bold leading-none w-4 h-4 flex items-center justify-center">🎯</span>
          </div>
          <span className="text-sm font-medium">{data.label as string || '执行动作 node'}</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground font-normal">选择动作模式</Label>
            <Select value={actionType} onValueChange={handleActionChange}>
              <SelectTrigger className="h-8 text-xs border-input bg-background shadow-none">
                <SelectValue placeholder="动作模式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="navigate">打开网页 (Goto URL)</SelectItem>
                <SelectItem value="click">点击元素 (Click)</SelectItem>
                <SelectItem value="type">填写内容 (Type Text)</SelectItem>
                <SelectItem value="wait">等待延迟 (Wait Time)</SelectItem>
                <SelectItem value="screenshot">截取页面 (Screenshot)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {actionType === 'navigate' && (
            <div className="flex flex-col gap-1.5">
               <Label className="text-xs text-muted-foreground font-normal">目标网址 (URL)</Label>
               <Input 
                 placeholder="https://example.com" 
                 className="h-8 text-xs border-input shadow-none nodrag" 
                 value={data.url as string || ''} 
                 onChange={e => handleFieldChange('url', e.target.value)} 
               />
            </div>
          )}

          {actionType === 'click' && (
            <div className="flex flex-col gap-1.5">
               <Label className="text-xs text-muted-foreground font-normal">目标选择器 (Selector / Ref)</Label>
               <Input 
                 placeholder="#submit-btn 或 @e5" 
                 className="h-8 text-xs border-input shadow-none nodrag" 
                 value={data.selector as string || ''} 
                 onChange={e => handleFieldChange('selector', e.target.value)} 
               />
            </div>
          )}

          {actionType === 'type' && (
            <>
              <div className="flex flex-col gap-1.5">
                 <Label className="text-xs text-muted-foreground font-normal">目标选择器 (Selector / Ref)</Label>
                 <Input 
                   placeholder="#username 或 @e1" 
                   className="h-8 text-xs border-input shadow-none nodrag" 
                   value={data.selector as string || ''} 
                   onChange={e => handleFieldChange('selector', e.target.value)} 
                 />
              </div>
              <div className="flex flex-col gap-1.5">
                 <Label className="text-xs text-muted-foreground font-normal">填写内容 (Input Value)</Label>
                 <Input 
                   placeholder="输入需填写的文本" 
                   className="h-8 text-xs border-input shadow-none nodrag" 
                   value={data.inputValue as string || ''} 
                   onChange={e => handleFieldChange('inputValue', e.target.value)} 
                 />
              </div>
            </>
          )}

          {actionType === 'wait' && (
            <div className="flex flex-col gap-1.5">
               <Label className="text-xs text-muted-foreground font-normal">等待时长 (毫秒)</Label>
               <Input 
                 type="number"
                 placeholder="2000" 
                 className="h-8 text-xs border-input shadow-none nodrag" 
                 value={data.duration as string || ''} 
                 onChange={e => handleFieldChange('duration', e.target.value)} 
               />
            </div>
          )}

        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </div>
  );
}
