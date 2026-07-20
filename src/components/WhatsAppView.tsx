/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, CheckCheck, Sparkles, Music, HelpCircle, PhoneCall } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'student' | 'sofia';
  text: string;
  timestamp: string;
}

interface WhatsAppViewProps {
  initialInstrument?: string;
  onBookClick?: () => void;
}

export default function WhatsAppView({ initialInstrument = 'Piano', onBookClick }: WhatsAppViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize conversations
  useEffect(() => {
    setMessages([
      {
        id: 'msg-1',
        sender: 'sofia',
        text: '¡Hola! Bienvenido al chat de soporte de Armonía 🎹. Mi nombre es Sofía Calderón, asesora académica estrella de la institución.',
        timestamp: 'Ahora'
      },
      {
        id: 'msg-2',
        sender: 'sofia',
        text: `Veo que tienes interés en aprender música de forma moderna con nosotros en ${initialInstrument}. ¿En cuál de las siguientes opciones puedo asesorarte hoy mismo?`,
        timestamp: 'Ahora'
      }
    ]);
  }, [initialInstrument]);

  // Handle messages scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Save student message
    const msgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const studentMsg: ChatMessage = {
      id: `m-student-${Date.now()}`,
      sender: 'student',
      text: text,
      timestamp: msgTime
    };

    setMessages(prev => [...prev, studentMsg]);
    setInputText('');
    setIsTyping(true);

    // Dynamic response from Sofia
    setTimeout(() => {
      setIsTyping(false);
      let responseText = '';
      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (text.toLowerCase().includes('gratis') || text.toLowerCase().includes('agendar')) {
        responseText = '¡Excelente decisión! Las clases de cortesía de 45 minutos te permiten conocer nuestra metodología, aula interactiva y profesores sin compromiso alguno. Te sugiero completar el formulario en la pestaña "Inicio" o proporcionarme tu número telefónico para llamarte en 5 minutos.';
      } else if (text.toLowerCase().includes('costo') || text.toLowerCase().includes('precio') || text.toLowerCase().includes('planes')) {
        responseText = 'Nuestros planes van desde $120 USD mensuales. Tenemos membresías "Pro" que incluyen acceso ilimitado a talleres online en vivo semanales, pistas interactivas avanzadas, masterclasses adicionales de teoría y tutoría de reforzamiento por videollamada.';
      } else if (text.toLowerCase().includes('recital') || text.toLowerCase().includes('concierto')) {
        responseText = '¡Los recitales son el alma de la escuela! Organizamos conciertos online interactivos semestrales transmitidos en vivo con calidad HD para que compartas tu talento con seres queridos y amigos de cualquier parte del mundo.';
      } else if (text.toLowerCase().includes('virtual') || text.toLowerCase().includes('presencial')) {
        responseText = 'Nuestras clases son 100% en línea e interactivas para adaptarnos por completo a ti. Estudias la teoría con nuestro simulador y aula virtual autogestionada, y coordinas de lunes a sábado tus sesiones prácticas en vivo e individuales de 1 hora.';
      } else {
        responseText = '¡Qué gran pregunta! Para darte el mejor soporte personalizado sobre esa duda musical, ¿te parecería bien si un profesor especialista en el instrumento conversa contigo en una breve videollamada de 3 minutos hoy mismo?';
      }

      setMessages(prev => [...prev, {
        id: `m-sofia-${Date.now()}`,
        sender: 'sofia',
        text: responseText,
        timestamp: responseTime
      }]);
    }, 1500);
  };

  const quickOptions = [
    'Quiero agendar mi clase gratis 🎟',
    'Precios de mensualidades y planes 💳',
    '¿Cómo funciona la modalidad en línea? 💻',
    '¿Cuándo es el próximo Recital de Alumnos? 🎻',
  ];

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto pt-4 flex flex-col h-[82vh]" id="whatsapp-support-panel">
      {/* Header contact box resembling actual WhatsApp */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-md" id="whatsapp-header">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
              alt="Asesora Sofia"
              className="w-10 h-10 rounded-full object-cover border-2 border-brand-primary"
              referrerPolicy="no-referrer"
            />
            {/* Status dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm text-slate-805">Sofía Calderón</span>
              <Sparkles size={11} className="text-brand-secondary animate-pulse" />
            </div>
            <span className="text-[10px] text-green-600 font-mono font-bold">● Asesora Musical Activa</span>
          </div>
        </div>

        {/* Quick click phone block */}
        <button
          onClick={() => alert('¡Simulando llamada a Sofia Mendoza en el número +52 (55) 2831 9281. Un asesor musical se contactará contigo para continuar!')}
          className="p-2 hover:bg-slate-100 border border-slate-200 rounded-full text-brand-primary cursor-pointer transition-all"
          title="Llamada telefónica instantánea"
        >
          <PhoneCall size={16} />
        </button>
      </div>

      {/* Messages scrolling container area */}
      <div
        ref={scrollRef}
        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-y-auto space-y-4 text-left min-h-0 shadow-inner"
        id="chat-messages-container"
      >
        {messages.map((msg) => {
          const isSofia = msg.sender === 'sofia';
          
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                isSofia ? 'self-start mr-auto' : 'self-end ml-auto items-end'
              }`}
            >
              {/* Message balloon box */}
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                isSofia
                  ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none font-bold'
                  : 'bg-emerald-600 text-white font-extrabold rounded-tr-none'
              }`}>
                {msg.text}
              </div>
              
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[9px] text-slate-450 font-mono font-bold">{msg.timestamp}</span>
                {!isSofia && <CheckCheck size={12} className="text-green-500" />}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 self-start bg-white border border-slate-205 px-4 py-2.5 rounded-full text-[10px] text-slate-500 font-bold shadow-sm">
            <span className="animate-bounce text-brand-primary">●</span>
            <span className="animate-bounce delay-100 text-brand-secondary font-bold">●</span>
            <span className="animate-bounce delay-250 text-brand-tertiary">●</span>
            <span className="font-mono italic text-[9px] text-slate-450">Escribiendo sugerencias...</span>
          </div>
        )}
      </div>

      {/* Recommended Quick Query Chips */}
      {messages.length < 5 && (
        <div className="space-y-1.5 text-left" id="quick-reply-panel">
          <span className="text-[10px] font-mono text-slate-450 uppercase tracking-widest px-1 font-bold">Sugerencias Rápidas:</span>
          <div className="flex p-0.5 gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {quickOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSendMessage(opt)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-brand-primary/40 hover:bg-slate-50 rounded-full text-[10px] text-slate-600 hover:text-slate-900 font-mono font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input keyboard message typing area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="flex gap-2"
        id="chat-send-form"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe un mensaje de música..."
          className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-brand-primary focus:bg-white shadow-inner font-mono font-medium"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-3 bg-brand-primary border border-transparent hover:brightness-110 active:scale-90 text-white rounded-xl transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center shrink-0 shadow"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
