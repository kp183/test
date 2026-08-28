import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle,
  Radio,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  ListFilter,
  DollarSign,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartyPlan, ShoppingItem } from '../types';

interface VoiceControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PartyPlan;
  onApplyPlanModifications: (
    newItems?: ShoppingItem[],
    removedNames?: string[],
    swaps?: any[],
    updates?: any[],
    newRecipe?: any,
    updatedDetails?: any
  ) => { previousTotal: number; newTotal: number; budgetLimit: number; variance: number; itemsCount: number; totalSavings?: number };
  onNavigateTab: (tab: 'shopping' | 'drinks' | 'recipes' | 'timeline' | 'budget') => void;
  onOpenCheckout: () => void;
  onOpenWizard: () => void;
  onLoadScenario: (scenarioNumber: 1 | 2 | 3) => void;
  onAlignBudget: () => void;
  showToast: (msg: string) => void;
}

export const VoiceControlModal: React.FC<VoiceControlModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onApplyPlanModifications,
  onNavigateTab,
  onOpenCheckout,
  onOpenWizard,
  onLoadScenario,
  onAlignBudget,
  showToast
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceLog, setVoiceLog] = useState<{ id: string; speaker: 'user' | 'agent'; text: string; time: string }[]>([
    {
      id: 'voice-intro',
      speaker: 'agent',
      text: 'Voice Control active! Say a command like "Review list", "Add 3 bags of ice", "Check budget", or "Load Scenario 1".',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioFeedbackEnabled, setIsAudioFeedbackEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const speakText = (text: string) => {
    if (!isAudioFeedbackEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeaking(false);
    }
  };

  const addLog = (speaker: 'user' | 'agent', text: string) => {
    setVoiceLog(prev => [
      ...prev,
      {
        id: `vlog-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        speaker,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [voiceLog]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let currentInterim = '';
      let finalSpeech = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalSpeech += event.results[i][0].transcript;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(currentInterim);

      if (finalSpeech.trim()) {
        const spoken = finalSpeech.trim();
        setTranscript(spoken);
        setInterimTranscript('');
        handleVoiceCommand(spoken);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition event error:', event.error);
      if (event.error === 'not-allowed') {
        showToast('Microphone access was denied. Please allow microphone permissions.');
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // If modal is open and should keep listening, restart
      if (isListening && isOpen) {
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [isOpen]);

  // Handle auto-starting listening when modal opens
  useEffect(() => {
    if (isOpen && speechSupported) {
      startListening();
      speakText('CymbalMart Voice Control active. How can I help with your party shopping?');
    } else {
      stopListening();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      // Already running or error
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {}
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Process Hands-Free Voice Commands
  const handleVoiceCommand = async (commandText: string) => {
    addLog('user', commandText);
    const cmd = commandText.toLowerCase().trim();
    setIsProcessing(true);

    // 1. SCENARIO SWITCHING COMMANDS
    if (cmd.includes('scenario 1') || cmd.includes('children') || cmd.includes('superhero birthday') || cmd.includes('kids birthday')) {
      onLoadScenario(1);
      const reply = "Loaded Scenario 1: Children's Birthday Party with 15 guests and Superhero theme. All shopping items and budget are updated!";
      addLog('agent', reply);
      speakText(reply);
      showToast("Loaded Scenario 1 (Superhero Birthday)");
      setIsProcessing(false);
      return;
    }

    if (cmd.includes('scenario 2') || cmd.includes('corporate') || cmd.includes('team building') || cmd.includes('summit')) {
      onLoadScenario(2);
      const reply = "Loaded Scenario 2: Corporate Team Building Event for 50 guests. Added catering trays, beverage variety, and office badges!";
      addLog('agent', reply);
      speakText(reply);
      showToast("Loaded Scenario 2 (Corporate Event)");
      setIsProcessing(false);
      return;
    }

    if (cmd.includes('scenario 3') || cmd.includes('wedding') || cmd.includes('garden') || cmd.includes('outdoor wedding')) {
      onLoadScenario(3);
      const reply = "Loaded Scenario 3: Outdoor Garden Wedding Reception for 100 guests with weather canopies, seating, and champagne toast!";
      addLog('agent', reply);
      speakText(reply);
      showToast("Loaded Scenario 3 (Outdoor Wedding)");
      setIsProcessing(false);
      return;
    }

    // 2. WIZARD & PARTY DEFINITION
    if (cmd.includes('define event') || cmd.includes('new party') || cmd.includes('start wizard') || cmd.includes('open wizard') || cmd.includes('plan party')) {
      onOpenWizard();
      const reply = "Opening the Party Definition Wizard for you now.";
      addLog('agent', reply);
      speakText(reply);
      setIsProcessing(false);
      return;
    }

    // 3. NAVIGATION COMMANDS
    if (cmd.includes('review list') || cmd.includes('shopping list') || cmd.includes('show list') || cmd.includes('open list')) {
      onNavigateTab('shopping');
      const reply = `Switched to your shopping list. You have ${currentPlan.shoppingList.length} items totaling $${currentPlan.estimatedTotalCost.toFixed(2)}.`;
      addLog('agent', reply);
      speakText(reply);
      setIsProcessing(false);
      return;
    }

    if (cmd.includes('drink') || cmd.includes('beverage') || cmd.includes('bar')) {
      onNavigateTab('drinks');
      const reply = `Showing beverage calculator. Estimated ${currentPlan.drinkCalculator.totalEstimatedDrinks} total drinks needed.`;
      addLog('agent', reply);
      speakText(reply);
      setIsProcessing(false);
      return;
    }

    if (cmd.includes('recipe') || cmd.includes('menu') || cmd.includes('food')) {
      onNavigateTab('recipes');
      const reply = `Showing party menu and recipes for ${currentPlan.details.title}.`;
      addLog('agent', reply);
      speakText(reply);
      setIsProcessing(false);
      return;
    }

    if (cmd.includes('timeline') || cmd.includes('schedule') || cmd.includes('prep')) {
      onNavigateTab('timeline');
      const reply = "Showing prep timeline and checklist from 4 days before party kickoff.";
      addLog('agent', reply);
      speakText(reply);
      setIsProcessing(false);
      return;
    }

    if (cmd.includes('budget summary') || cmd.includes('breakdown')) {
      onNavigateTab('budget');
      const reply = "Showing comprehensive cost breakdown and savings analysis.";
      addLog('agent', reply);
      speakText(reply);
      setIsProcessing(false);
      return;
    }

    // 4. CHECKOUT & FINALIZE COMMANDS
    if (cmd.includes('checkout') || cmd.includes('finalize') || cmd.includes('place order') || cmd.includes('pay') || cmd.includes('buy')) {
      onOpenCheckout();
      const reply = `Opening CymbalMart Express Checkout. Ready to fulfill ${currentPlan.shoppingList.length} items for $${currentPlan.estimatedTotalCost.toFixed(2)}.`;
      addLog('agent', reply);
      speakText(reply);
      setIsProcessing(false);
      return;
    }

    // 5. BUDGET & PRICE CHECK
    if (cmd.includes('check budget') || cmd.includes('how much') || cmd.includes('what is the total') || cmd.includes("what's the total") || cmd.includes('my budget')) {
      const remaining = currentPlan.details.budgetLimit - currentPlan.estimatedTotalCost;
      const statusText = remaining >= 0
        ? `You are within budget with $${remaining.toFixed(2)} remaining.`
        : `You are $${Math.abs(remaining).toFixed(2)} over your $${currentPlan.details.budgetLimit} budget.`;
      const reply = `Current total is $${currentPlan.estimatedTotalCost.toFixed(2)} for ${currentPlan.shoppingList.length} items. ${statusText}`;
      addLog('agent', reply);
      speakText(reply);
      setIsProcessing(false);
      return;
    }

    // 6. ALIGN BUDGET / ROLLBACK COMMAND
    if (cmd.includes('align budget') || cmd.includes('save money') || cmd.includes('rollback') || cmd.includes('cheaper') || cmd.includes('cut cost')) {
      onAlignBudget();
      const reply = "Applied CymbalMart store brand rollbacks to align your items with the budget. Recalculated total!";
      addLog('agent', reply);
      speakText(reply);
      setIsProcessing(false);
      return;
    }

    // 7. READ LIST COMMAND
    if (cmd.includes('read list') || cmd.includes('what is on my list') || cmd.includes("what's on my list") || cmd.includes('read items')) {
      const topItems = currentPlan.shoppingList.slice(0, 5).map(i => `${i.name} at $${i.estimatedCost.toFixed(2)}`).join(', ');
      const reply = `Your shopping list contains ${currentPlan.shoppingList.length} items totaling $${currentPlan.estimatedTotalCost.toFixed(2)}. Key items include: ${topItems}, and more.`;
      addLog('agent', reply);
      speakText(reply);
      setIsProcessing(false);
      return;
    }

    // 8. DELEGATE COMPLEX & ITEM MODIFICATIONS TO GEMINI ASSISTANT
    try {
      const response = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: commandText,
          currentPlan,
          chatHistory: []
        })
      });

      const data = await response.json();

      if (response.ok) {
        const hasModifications =
          (data.addedItems && data.addedItems.length > 0) ||
          (data.removedItemNames && data.removedItemNames.length > 0) ||
          (data.swappedItems && data.swappedItems.length > 0) ||
          (data.updatedItems && data.updatedItems.length > 0) ||
          data.newRecipe ||
          data.updatedDetails;

        if (hasModifications) {
          const stats = onApplyPlanModifications(
            data.addedItems,
            data.removedItemNames,
            data.swappedItems,
            data.updatedItems,
            data.newRecipe,
            data.updatedDetails
          );

          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.6 }
          });

          const reply = `${data.replyText || "I've updated your CymbalMart shopping list."} New total is $${stats.newTotal.toFixed(2)}.`;
          addLog('agent', reply);
          speakText(reply);
        } else {
          const reply = data.replyText || "I understood your request. Let me know if you want to add or remove any items.";
          addLog('agent', reply);
          speakText(reply);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Voice assistant processing error:', err);
      const fallbackReply = `I heard: "${commandText}". Try saying "Review list", "Add ice", or "Load Scenario 1".`;
      addLog('agent', fallbackReply);
      speakText(fallbackReply);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickCommandClick = (sampleCmd: string) => {
    handleVoiceCommand(sampleCmd);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 no-print">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border ${
                isListening 
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-amber-300 border-blue-400/50 shadow-blue-500/30 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isListening ? <Mic className="w-5 h-5 text-white animate-bounce" /> : <MicOff className="w-5 h-5" />}
              </div>
              {isListening && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-white">Hands-Free Voice Control</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  {isListening ? 'LISTENING LIVE' : 'MIC PAUSED'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Complete the entire CymbalMart party planning process by voice</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAudioFeedbackEnabled(!isAudioFeedbackEnabled)}
              title={isAudioFeedbackEnabled ? "Voice Feedback On (click to mute)" : "Voice Feedback Muted"}
              className={`p-2 rounded-xl border transition-colors ${
                isAudioFeedbackEnabled 
                  ? 'bg-slate-800 text-blue-400 border-slate-700 hover:bg-slate-700' 
                  : 'bg-slate-800/40 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
            >
              {isAudioFeedbackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Audio Visualizer / Status Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleListening}
              className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Pause Microphone</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Start Microphone</span>
                </>
              )}
            </button>

            {/* Audio Wave Simulation */}
            {isListening && (
              <div className="flex items-center gap-1 h-6 px-3 bg-slate-950/50 rounded-full border border-blue-500/20">
                <div className="w-1 bg-blue-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-4"></div>
                <div className="w-1 bg-indigo-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s] h-5"></div>
                <div className="w-1 bg-amber-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s] h-3"></div>
                <div className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.3s] h-5"></div>
                <div className="w-1 bg-blue-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.4s] h-4"></div>
                <span className="text-[11px] text-blue-200 font-medium ml-1">Speak anytime...</span>
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium">Active Cart Total</div>
            <div className="text-sm font-extrabold text-amber-400 font-mono">
              ${currentPlan.estimatedTotalCost.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Live Transcript / Conversation Log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-950/70 min-h-[220px]">
          {voiceLog.map((log) => {
            const isAgent = log.speaker === 'agent';
            return (
              <div
                key={log.id}
                className={`flex items-start gap-2.5 ${isAgent ? 'justify-start' : 'justify-end'}`}
              >
                {isAgent && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✳
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isAgent
                      ? 'bg-slate-800 border border-slate-700 text-slate-100'
                      : 'bg-blue-600 text-white rounded-tr-xs'
                  }`}
                >
                  <p>{log.text}</p>
                  <span className="text-[10px] text-slate-400 block text-right mt-1">{log.time}</span>
                </div>
              </div>
            );
          })}

          {interimTranscript && (
            <div className="flex items-start gap-2.5 justify-end">
              <div className="max-w-[80%] rounded-2xl p-3 text-xs bg-blue-900/60 border border-blue-500/40 text-blue-100 italic">
                {interimTranscript}...
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-blue-300 bg-slate-800/80 p-2.5 rounded-xl w-fit border border-blue-500/30">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span>Processing voice command & recalculating budget...</span>
            </div>
          )}

          <div ref={logEndRef} />
        </div>

        {/* Hands-Free Voice Commands Matrix */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Hands-Free CUJ Voice Commands
            </span>
            <span className="text-[10px] text-slate-500">Tap or speak aloud</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickCommandClick('Load Scenario 1')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-500/40 text-left transition-all group"
            >
              <div className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
                <span>"Scenario 1"</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
              </div>
              <div className="text-[10px] text-slate-400">Kids Birthday (15 guests, Superhero)</div>
            </button>

            <button
              onClick={() => handleQuickCommandClick('Load Scenario 2')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-500/40 text-left transition-all group"
            >
              <div className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
                <span>"Scenario 2"</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
              </div>
              <div className="text-[10px] text-slate-400">Corporate Event (50 guests)</div>
            </button>

            <button
              onClick={() => handleQuickCommandClick('Load Scenario 3')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-500/40 text-left transition-all group"
            >
              <div className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
                <span>"Scenario 3"</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
              </div>
              <div className="text-[10px] text-slate-400">Outdoor Wedding (100 guests)</div>
            </button>

            <button
              onClick={() => handleQuickCommandClick('Review shopping list')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-500/40 text-left transition-all group"
            >
              <div className="text-[11px] font-bold text-blue-300 flex items-center justify-between">
                <span>"Review list"</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
              </div>
              <div className="text-[10px] text-slate-400">View items & aisle guide</div>
            </button>

            <button
              onClick={() => handleQuickCommandClick('Add 3 bags of party ice')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-500/40 text-left transition-all group"
            >
              <div className="text-[11px] font-bold text-emerald-300 flex items-center justify-between">
                <span>"Add 3 bags of ice"</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
              </div>
              <div className="text-[10px] text-slate-400">Auto recalculate budget</div>
            </button>

            <button
              onClick={() => handleQuickCommandClick('Checkout and place order')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-500/40 text-left transition-all group"
            >
              <div className="text-[11px] font-bold text-purple-300 flex items-center justify-between">
                <span>"Checkout order"</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
              </div>
              <div className="text-[10px] text-slate-400">Finalize & pickup/delivery</div>
            </button>
          </div>
        </div>

        {/* Text Fallback Input */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Or type a voice command (e.g. 'Align budget', 'Add 2 cases soda')..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                handleVoiceCommand(e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
            className="flex-1 px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder*="Or type a voice command"]') as HTMLInputElement;
              if (input && input.value.trim()) {
                handleVoiceCommand(input.value.trim());
                input.value = '';
              }
            }}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
