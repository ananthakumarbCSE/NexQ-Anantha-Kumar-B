import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Video, Box, Upload, Play, RefreshCw, CheckCircle } from 'lucide-react';
import { trafficService } from '../services/trafficService';
import { ErrorState } from '../components/ErrorState';
import type { VideoAnalysisResponse } from '../types';

export const LiveDetectionPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResponse | null>(null);
  const [lane, setLane] = useState<string>('A');

  // Live status query
  const { data: liveStatus } = useQuery({
    queryKey: ['liveStatus'],
    queryFn: trafficService.getLiveStatus,
    refetchInterval: 3000,
  });

  // Video Analysis Mutation
  const analyzeMutation = useMutation({
    mutationFn: () => trafficService.analyzeVideo(selectedFile || undefined, lane),
    onSuccess: (data) => {
      setAnalysisResult(data);
      // Invalidate live queries to refresh dashboard & status panel
      queryClient.invalidateQueries({ queryKey: ['liveStatus'] });
      queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const counts = analysisResult?.vehicle_counts || {
    car: liveStatus?.vehicles || 12,
    bus: 2,
    truck: 3,
    motorcycle: 1,
    bicycle: 0,
    total: liveStatus?.vehicles || 18,
  };

  const total = counts.total || 1;

  const classData = [
    { type: 'Car', count: counts.car, pct: Math.round((counts.car / total) * 100), color: 'bg-blue-500' },
    { type: 'Bus', count: counts.bus, pct: Math.round((counts.bus / total) * 100), color: 'bg-amber-500' },
    { type: 'Truck', count: counts.truck, pct: Math.round((counts.truck / total) * 100), color: 'bg-emerald-500' },
    { type: 'Motorcycle', count: counts.motorcycle, pct: Math.round((counts.motorcycle / total) * 100), color: 'bg-indigo-500' },
    { type: 'Bicycle', count: counts.bicycle, pct: Math.round((counts.bicycle / total) * 100), color: 'bg-slate-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-50 tracking-tight">Live Detection & Video Analysis</h2>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Upload traffic videos for real-time YOLOv8 inferencing and vehicle count classification.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            YOLO ENGINE: ACTIVE
          </span>
        </div>
      </div>

      {/* Video Upload & Controls Bar */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center space-x-2 text-slate-200">
            <Upload className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold">Video File Upload & Run Inference</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Supported: .mp4, .avi, .mov, .mkv</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* File Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Select Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
            />
          </div>

          {/* Target Approach Lane */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Approach Lane</label>
            <select
              value={lane}
              onChange={(e) => setLane(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="A">Lane A (North Approach)</option>
              <option value="B">Lane B (East Approach)</option>
              <option value="C">Lane C (South Approach)</option>
              <option value="D">Lane D (West Approach)</option>
            </select>
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={() => analyzeMutation.mutate()}
              disabled={analyzeMutation.isPending}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors border border-blue-400/30 shadow-sm"
            >
              {analyzeMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing YOLO Inference...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{selectedFile ? 'Analyze Uploaded Video' : 'Run Analysis (Sample Video)'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {analyzeMutation.isError && (
          <ErrorState
            title="Analysis Error"
            message={analyzeMutation.error.message}
            onRetry={() => analyzeMutation.mutate()}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video Viewport */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center space-x-2 text-slate-200">
              <Video className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold">Detection Stream Viewport – Approach Lane {lane}</span>
            </div>
            {analysisResult && (
              <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Processed {analysisResult.frames_processed} frames ({analysisResult.inference_time_ms}ms)</span>
              </span>
            )}
          </div>

          {/* Viewport Box */}
          <div className="relative w-full h-96 bg-slate-900 rounded-lg border border-slate-700/80 flex items-center justify-center overflow-hidden p-6 select-none">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Bounding Box Graphic Simulation */}
            <div className="absolute top-1/4 left-1/3 w-32 h-20 border-2 border-emerald-500 rounded p-1 flex items-start justify-between">
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold font-mono px-1 rounded">
                car 98%
              </span>
            </div>

            <div className="absolute bottom-1/3 right-1/4 w-40 h-28 border-2 border-blue-500 rounded p-1 flex items-start justify-between">
              <span className="bg-blue-500 text-slate-950 text-[10px] font-bold font-mono px-1 rounded">
                bus 94%
              </span>
            </div>

            <div className="text-center space-y-2 z-10">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-blue-400">
                <Eye className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">
                {analysisResult ? 'YOLOv8 Analysis Complete' : 'YOLOv8 Detection Stream Viewport'}
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                {analysisResult 
                  ? `Recommended Green Duration: ${analysisResult.recommendation.green_time}s (${analysisResult.density.level} Density)`
                  : 'Click "Run Analysis" above to upload a video or analyze the sample video.'}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Breakdown List */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Box className="w-4 h-4 text-blue-400" />
              <span>Detections Breakdown</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Total: {total}</span>
          </div>

          <div className="space-y-4">
            {classData.map((item) => (
              <div key={item.type} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{item.type}</span>
                  <span className="font-mono text-slate-400">{item.count} ({isNaN(item.pct) ? 0 : item.pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${isNaN(item.pct) ? 0 : item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
