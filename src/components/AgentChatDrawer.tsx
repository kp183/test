import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShoppingBag, 
  Check, 
  DollarSign, 
  RefreshCw, 
  HelpCircle, 
  Zap,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Trash2,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartyPlan, ChatMessage, ShoppingItem } from '../types';

interface AgentChatDrawerProps {
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
  onNavigateToShoppingTab?: () => void;
}

const QUICK_PROMPTS = [
  '🛒 Add 2 packs of CymbalMart Brioche Buns & Cheddar Slices',
  '💸 Reduce list cost to fit under our budget with store brands',
  '🌱 Swap meats for plant-based vegan sausages & patties',
  '🍹 Add a Sparkling Citrus Sangria recipe & ingredients',
  '🗑️ Remove all alcoholic drinks from the shopping list',
  '🧊 Add 3 bags of party ice and cooler supplies'
];

export const AgentChatDrawer: React.FC<AgentChatDrawerProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onApplyPlanModifications,
  onNavigateToShoppingTab
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'agent',
      text: `Hello! I'm your **CymbalMart Assistant**.\n\nI can help you customize your shopping list for "${currentPlan.details.title}", add ingredients, swap brands for lower prices, remove unwanted items, and automatically recalculate your budget totals in real-time.\n\nHow can I help with your shopping list today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputText;
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          currentPlan,
          chatHistory: messages.slice(-6)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get CymbalMart Assistant response');
      }

      // Check if any modifications occurred
      const hasModifications = 
        (data.addedItems && data.addedItems.length > 0) ||
        (data.removedItemNames && data.removedItemNames.length > 0) ||
        (data.swappedItems && data.swappedItems.length > 0) ||
        (data.updatedItems && data.updatedItems.length > 0) ||
        data.newRecipe ||
        data.updatedDetails;

      let budgetStats: any = null;
      if (hasModifications) {
        budgetStats = onApplyPlanModifications(
          data.addedItems,
          data.removedItemNames,
          data.swappedItems,
          data.updatedItems,
          data.newRecipe,
          data.updatedDetails
        );

        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.replyText || "I've reviewed your request and updated your CymbalMart shopping list and budget!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modifiedItemsSummary: data.modifiedSummary || [],
        recalculatedBudget: budgetStats || undefined
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error: any) {
      console.error('CymbalMart Assistant chat error:', error);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: `I had a brief connection issue reaching the CymbalMart service. Please try again or tell me what item to add or remove!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col no-print animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-amber-300 shadow-md shadow-blue-500/30 border border-blue-400/30 font-black text-lg">
            ✳
          </div>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <span>CymbalMart Assistant</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-600/80 text-amber-300 border border-blue-400/30">
                AI CONCIERGE
              </span>
            </h2>
            <p className="text-[11px] text-slate-300">Smart Shopping & Automatic Budget Optimizer</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close CymbalMart Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAgent ? 'justify-start' : 'justify-end'}`}
            >
              {isAgent && (
                <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                  ✳
                </div>
              )}

              <div
                className={`max-w-[90%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed space-y-2 shadow-2xs ${
                  isAgent
                    ? 'bg-white border border-slate-200 text-slate-800'
                    : 'bg-slate-950 text-white rounded-tr-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Recalculated Budget Callout Card */}
                {msg.recalculatedBudget && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-xl p-3 text-xs text-slate-800 border border-blue-100 space-y-2">
                    <div className="flex items-center justify-between font-bold text-blue-900">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
                        <span>Budget Recalculated Automatically</span>
                      </div>
                      <span className="text-[11px] font-mono text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                        {msg.recalculatedBudget.itemsCount} Items
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-blue-100/60">
                      <div className="bg-white/80 rounded-lg p-2 border border-blue-100">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">New Total Cost</div>
                        <div className="text-sm font-extrabold text-blue-700 font-mono">
                          {currentPlan.details.currency}{msg.recalculatedBudget.newTotal.toFixed(2)}
                        </div>
                      </div>

                      <div className="bg-white/80 rounded-lg p-2 border border-blue-100">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Target Budget</div>
                        <div className="text-sm font-extrabold text-slate-800 font-mono">
                          {currentPlan.details.currency}{msg.recalculatedBudget.budgetLimit.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] px-1 font-semibold">
                      <span className="text-slate-600">Budget Status:</span>
                      {msg.recalculatedBudget.variance <= 0 ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5" />
                          Within Budget ({currentPlan.details.currency}{Math.abs(msg.recalculatedBudget.variance).toFixed(2)} remaining)
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {currentPlan.details.currency}{msg.recalculatedBudget.variance.toFixed(2)} over target
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Plan Modifications Callout */}
                {msg.modifiedItemsSummary && msg.modifiedItemsSummary.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100 bg-slate-50 rounded-xl p-2.5 text-xs text-slate-700">
                    <div className="font-bold flex items-center gap-1 text-slate-900 mb-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Shopping List Updates:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                      {msg.modifiedItemsSummary.map((sumItem, i) => (
                        <li key={i}>{sumItem}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div
                  className={`text-[10px] text-right mt-1 ${
                    isAgent ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAgent && (
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200 w-fit shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span>CymbalMart Assistant is updating your list & recalculating budget...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-t border-slate-200 bg-white space-y-2">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <div className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-blue-600" />
            <span>Suggested Customer Prompts</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Click to send</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-200 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-3.5 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask CymbalMart Assistant to add, swap, or delete items..."
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            aria-label="Send message to CymbalMart Assistant"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
