"use client";

import { useEffect, useState } from "react";
import { browserApi } from "@/lib/api";
import mockData from "@/lib/mock-data.json";
import { Play, Square, Monitor, Globe, Activity, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 从 JSON 解析我们的 mock 结构
const profiles = mockData.profiles;

export default function BrowserDashboard() {
  const [runningEnvs, setRunningEnvs] = useState<Set<string>>(new Set());
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // 轮询当前运行状态
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { runningEnvs: envs } = await browserApi.getStatus();
        setRunningEnvs(new Set(envs));
      } catch (err) {
        console.error("Failed to fetch status", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000); // 每2秒查一次状态
    return () => clearInterval(interval);
  }, []);

  const handleStart = async (profile: any) => {
    setLoadingAction(profile.name);
    try {
      await browserApi.start({
        id: profile.name,
        cli_args: profile.cli_args,
      });
      setRunningEnvs(new Set([...runningEnvs, profile.name]));
    } catch (err: any) {
      alert("启动失败: " + err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleStop = async (id: string) => {
    setLoadingAction(id + "_stop");
    try {
      await browserApi.stop(id);
      const newSet = new Set(runningEnvs);
      newSet.delete(id);
      setRunningEnvs(newSet);
    } catch (err: any) {
      alert("停止失败: " + err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8 text-neutral-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">环境管理台</h1>
            <p className="text-neutral-500 mt-2">浆果浏览器 (Joii Berry) 离线测试控制台</p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span className="font-medium">守护进程已连接 (端口 4001)</span>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => {
            const isRunning = runningEnvs.has(profile.name);
            const isStarting = loadingAction === profile.name;
            const isStopping = loadingAction === profile.name + "_stop";

            return (
              <Card key={profile.name} className={`overflow-hidden transition-all duration-200 ${isRunning ? 'ring-2 ring-emerald-500/50 shadow-md' : 'hover:shadow-md'}`}>
                <CardHeader className="bg-white pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {profile.name}
                        {isRunning && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                            运行中
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2 text-sm">
                        {profile.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="bg-neutral-50/50 p-6">
                  <div className="space-y-4">
                    {/* Tags / Config Summary */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Monitor className="h-4 w-4 text-neutral-400" />
                        <span>{profile.cli_args["--fingerprint-platform"]} {profile.cli_args["--fingerprint-brand"]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Globe className="h-4 w-4 text-neutral-400" />
                        <span>{profile.cli_args["--timezone"]}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex items-center gap-3">
                      {!isRunning ? (
                        <Button 
                          onClick={() => handleStart(profile)} 
                          disabled={isStarting}
                          className="w-full bg-neutral-900 hover:bg-neutral-800 text-white"
                        >
                          {isStarting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                          启动环境
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleStop(profile.name)} 
                          disabled={isStopping}
                          variant="destructive"
                          className="w-full bg-red-500 hover:bg-red-600 text-white"
                        >
                          {isStopping ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Square className="mr-2 h-4 w-4" />}
                          结束进程
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}
