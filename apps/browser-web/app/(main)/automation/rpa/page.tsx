"use client"
import * as React from "react"
import { cloudFetch } from "@/lib/api"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { RiRobot2Line, RiAddLine, RiSave3Line, RiDeleteBinLine, RiPlayCircleLine } from "@remixicon/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// React Flow Imports
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Panel
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// Import our Custom Nodes
import { ActionNode } from "@/components/rpa-nodes/ActionNode"

const nodeTypes = {
  actionNode: ActionNode,
}

export default function RpaPage() {
  const [scripts, setScripts] = React.useState<any[]>([])
  const [activeScript, setActiveScript] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Form states for new script
  const [newScriptName, setNewScriptName] = React.useState("")
  const [newScriptGroup, setNewScriptGroup] = React.useState("default")
  const [groups, setGroups] = React.useState<any[]>([])

  // React Flow states
  const [nodes, setNodes] = React.useState<Node[]>([])
  const [edges, setEdges] = React.useState<Edge[]>([])

  const fetchScriptsAndGroups = React.useCallback(async () => {
    try {
      const [rpaReq, grpReq] = await Promise.all([
        cloudFetch(`/api/rpa`),
        cloudFetch(`/api/groups`)
      ])
      const rpaRes = await rpaReq.json()
      const grpRes = await grpReq.json()
      if (rpaRes.success) setScripts(rpaRes.data)
      if (grpRes.success) setGroups(grpRes.data)
    } catch (err) {
      console.error("Failed to fetch scripts:", err)
    }
  }, [])

  React.useEffect(() => {
    fetchScriptsAndGroups()
  }, [fetchScriptsAndGroups])

  const handleCreateScript = async () => {
    if (!newScriptName) return alert("脚本名称不能为空")
    setIsLoading(true)
    try {
      const res = await cloudFetch(`/api/rpa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newScriptName, groupId: newScriptGroup === 'default' ? null : newScriptGroup })
      })
      const data = await res.json()
      if (data.success) {
        setIsDialogOpen(false)
        setNewScriptName("")
        fetchScriptsAndGroups()
        loadScript(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadScript = (script: any) => {
    setActiveScript(script)
    try {
      setNodes(typeof script.nodes === 'string' ? JSON.parse(script.nodes) : script.nodes || [])
      setEdges(typeof script.edges === 'string' ? JSON.parse(script.edges) : script.edges || [])
      
      // If empty, add a default start node
      if ((!script.nodes || script.nodes.length === 0) && (!script.nodes || script.nodes === "[]")) {
        setNodes([
          { id: '1', type: 'input', data: { label: '起点 (Start)' }, position: { x: 250, y: 50 } },
        ])
      }
    } catch(e) {
      setNodes([])
      setEdges([])
    }
  }

  const handleSaveFlow = async () => {
    if (!activeScript) return
    try {
       const res = await cloudFetch(`/api/rpa/${activeScript.id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ nodes, edges })
       })
       const data = await res.json()
       if (data.success) {
         alert("画板保存成功！");
         setScripts(scripts.map(s => s.id === activeScript.id ? { ...s, nodes: JSON.stringify(nodes), edges: JSON.stringify(edges) } : s))
       } else {
         alert("保存失败：" + data.error)
       }
    } catch (err) {
      console.error(err)
    }
  }

  const handleExecute = () => {
    // Phase 5 Compiler: Compile nodes directly to an sequential array
    const incomingEdges = edges.map(e => e.target);
    const startNodes = nodes.filter(n => !incomingEdges.includes(n.id));
    
    if (startNodes.length === 0) {
      return alert("画布中没有找到起始节点！");
    }

    let cmds = [];
    let current: Node | undefined = startNodes[0];
    let visited = new Set(); // Prevent infinite loops
    
    while(current && !visited.has(current.id)) {
      visited.add(current.id);
      if (current.type === 'actionNode') {
        cmds.push({ ...current.data });
      }
      const nextEdge = edges.find(e => e.source === current!.id);
      if (nextEdge) {
        current = nodes.find(n => n.id === nextEdge.target);
      } else {
        break;
      }
    }

    // Format out an agent-browser mock CLI script just for demonstration of compilation
    let cliScript = cmds.map((cmd) => {
      switch(cmd.actionType) {
        case 'navigate': return `agent-browser open "${cmd.url || 'https://example.com'}"`;
        case 'click': return `agent-browser click "${cmd.selector || '@e1'}"`;
        case 'type': return `agent-browser fill "${cmd.selector || '@e1'}" "${cmd.inputValue || ''}"`;
        case 'wait': return `agent-browser wait ${cmd.duration || '2000'}`;
        case 'screenshot': return `agent-browser screenshot`;
        default: return `# undefined action`;
      }
    }).join(" && \\\n");

    alert("成功从画布解析为可执行的指令流！\n\n=== 编译结果 ===\n" + cliScript + "\n\n(注意：本地调用引擎即将对接，当前为输出预览。)");
  }

  const handleDeleteScript = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm("确定彻底删除此 RPA 脚本吗？")) return
    try {
      const res = await cloudFetch(`/api/rpa/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
         if (activeScript?.id === id) {
           setActiveScript(null)
           setNodes([])
           setEdges([])
         }
         fetchScriptsAndGroups()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // React Flow Handlers
  const onNodesChange = React.useCallback(
    (changes: NodeChange<Node>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = React.useCallback(
    (changes: EdgeChange<Edge>[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = React.useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Add the custom action node
  const addActionNode = () => {
    const newNode = {
      id: `node_${Date.now()}`,
      type: 'actionNode',
      data: { label: `执行动作 #${nodes.length}`, actionType: 'navigate' },
      position: { x: 250, y: 150 + nodes.length * 100 },
    }
    setNodes(nds => nds.concat(newNode))
  }

  return (
    <>
      <PageHeader breadcrumb={[{ label: "自动化与 API" }, { label: "RPA 自动化配置" }]} />
      <div className="flex flex-1 overflow-hidden bg-background">
        
        {/* Sidebar for RPA Scripts */}
        <div className="w-64 border-r border-border bg-muted/10 flex flex-col pt-2">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="font-medium text-sm text-foreground">我的脚本</span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-primary hover:bg-primary/10" disabled={isLoading}>
                  <RiAddLine className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] border-border bg-card text-foreground">
                <DialogHeader>
                  <DialogTitle>新建 RPA 脚本</DialogTitle>
                  <DialogDescription>创建新的自动化流程工作区。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4 text-right">
                    <Label className="text-muted-foreground text-sm">脚本名称</Label>
                    <Input 
                      className="col-span-3 border-input shadow-none h-9 text-left" 
                      placeholder="例如：自动登录发帖" 
                      value={newScriptName}
                      onChange={e => setNewScriptName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4 text-right">
                    <Label className="text-muted-foreground text-sm">所属分组</Label>
                    <div className="col-span-3 text-left">
                       <Select value={newScriptGroup} onValueChange={setNewScriptGroup}>
                         <SelectTrigger className="border-input shadow-none h-9">
                           <SelectValue placeholder="默认无可归属分组" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="default">无分组暂存区</SelectItem>
                           {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                         </SelectContent>
                       </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter className="pt-2">
                  <Button variant="outline" className="border-input shadow-none h-9" onClick={() => setIsDialogOpen(false)}>取消</Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9" onClick={handleCreateScript} disabled={isLoading}>
                    {isLoading ? "创建中..." : "创建画布"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {scripts.map(script => (
              <div 
                key={script.id}
                onClick={() => loadScript(script)}
                className={`group px-3 py-2 text-sm rounded-md font-medium cursor-pointer flex items-center justify-between transition-colors
                  ${activeScript?.id === script.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}
                `}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <RiRobot2Line className={`h-4 w-4 shrink-0 ${activeScript?.id === script.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="truncate">{script.name}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex items-center shrink-0">
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive" onClick={(e) => handleDeleteScript(e, script.id)}>
                    <RiDeleteBinLine className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {scripts.length === 0 && (
              <div className="text-center py-6 text-xs text-muted-foreground">暂无脚本，请新建</div>
            )}
          </div>
        </div>

        {/* Canvas for RPA Editor */}
        <div className="flex-1 flex flex-col bg-background relative">
          {activeScript ? (
            <>
              {/* Toolbar */}
              <div className="h-12 border-b border-border flex items-center px-4 justify-between bg-card z-10 w-full">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm text-foreground">{activeScript.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border"> 编辑模式 </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleSaveFlow} className="h-7 px-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm text-xs font-normal border border-border">
                    <RiSave3Line className="h-3.5 w-3.5 mr-1" /> 保存画板
                  </Button>
                  <Button size="sm" onClick={handleExecute} className="h-7 px-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm text-xs font-normal">
                    <RiPlayCircleLine className="h-3.5 w-3.5 mr-1" /> 编译并打印指令流
                  </Button>
                </div>
              </div>
              
              {/* React Flow Editor */}
              <div className="flex-1 w-full h-full p-0">
                <ReactFlow 
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  fitView
                  className="bg-card dark:bg-background"
                >
                  <Background color="hsl(var(--muted-foreground) / 0.2)" gap={16} />
                  <Controls className="bg-background border-border shadow-sm fill-foreground text-foreground" />
                  <Panel position="top-left" className="m-4">
                     <Button size="sm" onClick={addActionNode} variant="secondary" className="shadow-sm border border-border text-xs h-8 bg-background hover:bg-muted">
                        <RiAddLine className="h-4 w-4 mr-1" /> 拖入新动作组件
                     </Button>
                  </Panel>
                </ReactFlow>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-muted/20 flex flex-col items-center justify-center mb-4 text-muted-foreground/50 border border-border">
                <RiRobot2Line className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground text-sm">请在左侧选择或新建一个 RPA 脚本</p>
            </div>
          )}
        </div>

      </div>
    </>
  )
}
