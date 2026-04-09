import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Sparkles, ChevronLeft, Menu, PanelLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { CozeAPI } from '@coze/api';

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export const CustomerService = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: "我是智能客服小咪，有什么可以帮您？",
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"demo" | "workflow" | "log">("demo");
  const [debugUrl, setDebugUrl] = useState<string | null>(null);

  const [isLogOpen, setIsLogOpen] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "你好，这个订单202503050004发货了吗",
    "商品已经退回了，退款多久能到账",
    "想咨询下羊毛衫怎么洗"
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat_messages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages");
      }
    }
  }, []);

  // Save conversation to localStorage
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetchCozeWorkflow(userMessage.content);
      // Coze API returns { code: 0, data: "{\"output\":\"...\"}", msg: "success" }
      
      let output = "";
      
      if (response.code === 0 && response.data) {
        try {
          // data field is usually a JSON string containing the workflow output
          const dataObj = JSON.parse(response.data);
          output = dataObj.output || dataObj.data || JSON.stringify(dataObj);
        } catch (e) {
          // If data is not a JSON string, use it directly
          output = response.data;
        }
      } else {
        console.error("Coze API Error:", response);
        output = `服务响应异常: ${response.msg || "未知错误"}`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: output || "抱歉，我没有理解您的意思。",
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Failed to fetch:", error);
      
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "抱歉，服务调用失败。请检查网络连接或 Token 是否过期。",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }, 1000);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputValue);
  };

  const fetchCozeWorkflow = async (input: string) => {
    // 之前是直接在前端读取 Token，现在不再需要了
    // const token = import.meta.env.VITE_COZE_API_TOKEN; 
    
    // 调用我们自己的 API 路由 (位于 api/coze.ts)
    // 无论是本地开发 (vite proxy) 还是线上环境 (vercel functions)，路径都是 /api/coze
    const baseUrl = "/api/coze";

    const request = async (parameters: any) => {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 不再需要在 Authorization 头里传 Token，Token 由后端读取
        },
        body: JSON.stringify({
          // 如果后端已经配置了默认 workflowId，这里甚至可以不传，或者传此作为备选
          workflow_id: import.meta.env.VITE_COZE_WORKFLOW_ID, 
          parameters,
          // Add this so that Vite local dev server knows it needs to be processed by our plugin/serverless 
          // or we bypass the proxy and hit our actual dev server endpoint
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (errorText.includes("Missing required parameters") || res.status === 400) {
           throw new Error(`ParameterFormatError: ${errorText}`);
        }
        throw new Error(`API Error: ${res.status} - ${errorText}`);
      }

      return res.json();
    };

    // First attempt: object parameters
    try {
      const response = await request({ input });
      console.log('Coze Response:', response); // Debug log
      
      // Update debug URL if available
      if (response.debug_url) {
        setDebugUrl(response.debug_url);
      }
      
      return response;
    } catch (error: any) {
      // Only retry if it's a parameter format issue
      if (error.message && error.message.includes("ParameterFormatError")) {
         console.warn("First attempt failed with parameter error, retrying with stringified parameters...");
         // Fallback attempt: JSON string parameters
         // Note: Coze API sometimes requires the value of 'parameters' to be a JSON string
         // But usually for 'input', it expects an object. 
         // If the workflow expects a variable named 'input', pass { input: "value" }
         const retryResponse = await request(JSON.stringify({ input }));
         
         if (retryResponse.debug_url) {
           setDebugUrl(retryResponse.debug_url);
         }
         
         return retryResponse;
      }
      throw error;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen text-gray-800 flex flex-col items-center justify-center font-sans relative overflow-hidden p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/20 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-200/20 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-200/20 blur-[80px]" />
      </div>

      <div className="flex w-full max-w-[1400px] h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden relative z-10 border border-white/50">
      
      {/* Left Sidebar - Navigation */}
      <motion.div 
        initial={{ width: 240 }}
        animate={{ width: isSidebarOpen ? 240 : 64 }}
        className="bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0 z-20 overflow-hidden"
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center px-4 border-b border-gray-200/50 justify-between shrink-0">
           {isSidebarOpen ? (
             <>
               <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="whitespace-nowrap overflow-hidden">
                    <h2 className="font-bold text-gray-900 text-sm whitespace-nowrap">智能客服</h2>
                  </div>
               </div>
               <button 
                 onClick={() => setIsSidebarOpen(false)}
                 className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors shrink-0"
               >
                 <PanelLeft className="w-4 h-4" />
               </button>
             </>
           ) : (
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 mx-auto transition-colors"
             >
               <PanelLeft className="w-4 h-4" />
             </button>
           )}
        </div>
           
        {/* Navigation Links */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto overflow-x-hidden">
           <button 
             onClick={() => setActiveTab("demo")}
             className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
               activeTab === "demo" 
                 ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-100" 
                 : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
             } ${!isSidebarOpen && "justify-center px-0"}`}
             title={!isSidebarOpen ? "在线对话" : ""}
           >
             <div className={`w-2 h-2 rounded-full shrink-0 ${activeTab === "demo" ? "bg-blue-500" : "bg-gray-300"}`} />
             {isSidebarOpen && <span className="whitespace-nowrap">在线对话</span>}
           </button>
           
           <button 
             onClick={() => setActiveTab("workflow")}
             className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
               activeTab === "workflow" 
                 ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-100" 
                 : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
             } ${!isSidebarOpen && "justify-center px-0"}`}
             title={!isSidebarOpen ? "Workflow设计" : ""}
           >
             <div className={`w-2 h-2 rounded-full shrink-0 ${activeTab === "workflow" ? "bg-blue-500" : "bg-gray-300"}`} />
             {isSidebarOpen && <span className="whitespace-nowrap">Workflow设计</span>}
           </button>
           
           <button 
             onClick={() => setActiveTab("log")}
             className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
               activeTab === "log" 
                 ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-100" 
                 : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
             } ${!isSidebarOpen && "justify-center px-0"}`}
             title={!isSidebarOpen ? "执行日志" : ""}
           >
             <div className={`w-2 h-2 rounded-full shrink-0 ${activeTab === "log" ? "bg-blue-500" : "bg-gray-300"}`} />
             {isSidebarOpen && <span className="whitespace-nowrap">执行日志</span>}
           </button>
        </nav>
        
        {/* Bottom Actions */}
        <div className="p-2 border-t border-gray-200 space-y-1 shrink-0">
          <Link 
            to="/" 
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            title="返回首页"
          >
            {isSidebarOpen ? (
              <>
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">返回首页</span>
              </>
            ) : (
              <ArrowLeft className="w-4 h-4 mx-auto" />
            )}
          </Link>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        
        {/* Mobile Tabs (Visible only on small screens) */}
        <div className="md:hidden flex border-b border-gray-100 shrink-0">
           <button 
             onClick={() => setActiveTab("demo")}
             className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
               activeTab === "demo" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
             }`}
           >
             对话
           </button>
           <button 
             onClick={() => setActiveTab("workflow")}
             className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
               activeTab === "workflow" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
             }`}
           >
             设计
           </button>
           <button 
             onClick={() => setActiveTab("log")}
             className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
               activeTab === "log" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
             }`}
           >
             日志
           </button>
        </div>

        {/* Header - Conditional based on tab */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 bg-white z-10">
          {activeTab === "demo" && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <h2 className="font-semibold text-gray-900 text-sm">在线对话</h2>
              </div>
              <div className="text-xs text-gray-400">
                Session ID: {messages[messages.length - 1]?.id || 'init'}
              </div>
            </>
          )}
          
          {activeTab === "workflow" && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <h2 className="font-semibold text-gray-900 text-sm">Workflow设计</h2>
              </div>
              <div className="text-xs text-gray-400">
                Read Only Mode
              </div>
            </>
          )}
          
          {activeTab === "log" && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <h2 className="font-semibold text-gray-900 text-sm">执行日志</h2>
              </div>
              <div className="text-xs text-gray-400">
                Live Trace
              </div>
            </>
          )}
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 relative w-full h-full overflow-hidden">
          
          {/* Chat Tab Content */}
          <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${
            activeTab === "demo" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden mt-1">
                      <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4&clothing=hoodie&clothingColor=3c4f76&eyes=happy&eyebrows=default&mouth=smile&skin=light" 
                        alt="小咪"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-sm" 
                      : "bg-[#f7f8fa] text-gray-800 rounded-bl-sm border border-gray-100"
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {msg.role === "user" && (
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 overflow-hidden border border-white shadow-sm mt-1 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-blue-600">ME</span>
                     </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden mt-1">
                      <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4&clothing=hoodie&clothingColor=3c4f76&eyes=happy&eyebrows=default&mouth=smile&skin=light" 
                        alt="小咪"
                        className="w-full h-full object-cover"
                      />
                  </div>
                  <div className="bg-[#f7f8fa] text-gray-500 rounded-2xl rounded-bl-sm px-4 py-3 border border-gray-100 shadow-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <div className="max-w-4xl mx-auto w-full">
                {/* Quick Questions */}
                <div className="flex flex-nowrap gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none mask-fade-right">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(question)}
                      disabled={isLoading}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all duration-200 border ${
                        isLoading 
                          ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed" 
                          : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm"
                      }`}
                    >
                      {question}
                    </button>
                  ))}
                </div>

                <div className="relative flex items-end gap-2 bg-white rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all duration-300 shadow-sm">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入消息..."
                    className="w-full bg-transparent text-gray-800 placeholder-gray-400 text-sm resize-none focus:outline-none max-h-32 min-h-[44px] py-3 px-4"
                    rows={1}
                    style={{ height: 'auto', minHeight: '44px' }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className={`m-1 p-2 rounded-lg transition-all duration-200 ${
                      inputValue.trim() && !isLoading
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center mt-2">
                   <p className="text-[10px] text-gray-300">AI 生成内容可能不准确，请注意甄别</p>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Tab Content */}
           <div className={`absolute inset-0 bg-[#f7f8fa] flex flex-col transition-opacity duration-300 ${
             activeTab === "workflow" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
           }`}>
             <div className="flex-1 overflow-auto flex items-center justify-center p-8">
               <img 
                 src="/workflow.png" 
                 alt="Coze Workflow Diagram" 
                 className="max-w-full max-h-full object-contain shadow-sm rounded-lg border border-gray-200 bg-white"
               />
             </div>
           </div>

           {/* Log Tab Content */}
           <div className={`absolute inset-0 bg-white flex flex-col transition-opacity duration-300 ${
             activeTab === "log" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
           }`}>
             <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
               {debugUrl ? (
                 <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                   <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 mx-auto border-4 border-green-100">
                     <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                   </div>
                   <h4 className="text-xl font-bold text-gray-900 mb-3">执行成功</h4>
                   <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                     工作流已完成执行，您可以点击下方链接跳转至 Coze 平台，<br/>查看本次对话的完整节点数据与 Trace 信息。
                   </p>
                   <a 
                     href={debugUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors w-full"
                   >
                     查看完整执行日志
                     <ArrowLeft className="w-4 h-4 rotate-180" />
                   </a>
                 </div>
               ) : (
                 <div className="text-gray-400">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 mx-auto border-4 border-gray-100">
                     <Sparkles className="w-8 h-8 text-gray-300" />
                   </div>
                   <p className="text-lg font-medium text-gray-500 mb-2">暂无执行数据</p>
                   <p className="text-sm opacity-60">
                     请先在“在线对话”中发送消息
                   </p>
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
    </div>
  );
};
