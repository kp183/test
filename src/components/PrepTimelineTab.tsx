import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Sparkles, 
  AlertCircle, 
  Tag, 
  Flame,
  Music,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartyPlan, TimelineStep } from '../types';

interface PrepTimelineTabProps {
  plan: PartyPlan;
  onToggleTimelineStep: (stepId: string) => void;
  onAddTimelineStep: (step: Omit<TimelineStep, 'id' | 'completed'>) => void;
}

const TIMEFRAMES = [
  '3-4 Days Before',
  '1-2 Days Before',
  'Day of Party (Morning)',
  '2 Hours Before Guests Arrive',
  'Party Kickoff'
] as const;

export const PrepTimelineTab: React.FC<PrepTimelineTabProps> = ({
  plan,
  onToggleTimelineStep,
  onAddTimelineStep
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newTimeframe, setNewTimeframe] = useState<TimelineStep['timeframe']>('1-2 Days Before');
  const [newCategory, setNewCategory] = useState<TimelineStep['category']>('Prep & Cooking');
  const [newTip, setNewTip] = useState('');

  const completedCount = plan.timeline.filter(t => t.completed).length;
  const totalSteps = plan.timeline.length;

  const handleToggle = (id: string) => {
    onToggleTimelineStep(id);
    const step = plan.timeline.find(s => s.id === id);
    if (step && !step.completed && completedCount + 1 === totalSteps) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    onAddTimelineStep({
      task: newTask.trim(),
      timeframe: newTimeframe,
      category: newCategory,
      tip: newTip.trim() || undefined
    });

    setNewTask('');
    setNewTip('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            <span>Host Countdown & Prep Timeline</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Zero-stress schedule ensuring everything is cooked, chilled, and decorated well before the doorbell rings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800">
              {completedCount} / {totalSteps} Completed
            </div>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-emerald-500 rounded-full transition-all"
                style={{ width: `${totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Timeline Steps by Timeframe */}
      <div className="space-y-6">
        {TIMEFRAMES.map((timeframe, index) => {
          const stepsInTimeframe = plan.timeline.filter(t => t.timeframe === timeframe);
          if (stepsInTimeframe.length === 0) return null;

          return (
            <div
              key={timeframe}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
            >
              <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{timeframe}</h3>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {stepsInTimeframe.filter(s => s.completed).length} / {stepsInTimeframe.length} Done
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {stepsInTimeframe.map((step) => (
                  <div
                    key={step.id}
                    className={`p-4 sm:px-5 flex items-start gap-3 transition-colors ${
                      step.completed ? 'bg-slate-50/70' : 'hover:bg-slate-50/30'
                    }`}
                  >
                    <button
                      onClick={() => handleToggle(step.id)}
                      className="mt-0.5 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                      aria-label={`Toggle task completion`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-baseline flex-wrap gap-2">
                        <span
                          className={`text-sm font-medium ${
                            step.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                          }`}
                        >
                          {step.task}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                          {step.category}
                        </span>
                      </div>

                      {step.tip && (
                        <p className="text-xs text-amber-800 bg-amber-50/70 px-2.5 py-1 rounded-lg border border-amber-200/60 inline-block">
                          💡 <strong>Pro Tip:</strong> {step.tip}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-500" />
              <span>Add Countdown Timeline Task</span>
            </h3>

            <form onSubmit={handleAddTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Description *</label>
                <input
                  type="text"
                  required
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="e.g. Put beer cooler on ice, light patio citronella candles"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Timeframe</label>
                  <select
                    value={newTimeframe}
                    onChange={(e) => setNewTimeframe(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                  >
                    {TIMEFRAMES.map(tf => (
                      <option key={tf} value={tf}>{tf}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                  >
                    <option value="Shopping">Shopping</option>
                    <option value="Prep & Cooking">Prep & Cooking</option>
                    <option value="Decor & Setup">Decor & Setup</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Host Readiness">Host Readiness</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Helpful Note / Tip (Optional)</label>
                <input
                  type="text"
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="e.g. Set a phone timer for 30 mins before start"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
