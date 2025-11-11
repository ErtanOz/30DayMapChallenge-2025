import React, { useState, useRef, useEffect, useCallback } from 'react';
import PanelSection from './PanelSection';
import Button from './Button';
import { sendToGemini } from '../services/geminiService';
import { AppData, ChatMessage, PegelData } from '../types';

interface AIAssistantProps {
  airData: AppData | null;
  pegelData: PegelData | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ airData, pegelData }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const generateSystemInstruction = useCallback(() => {
    let instruction = `You are a helpful AI assistant providing summaries and insights about environmental data. `;
    instruction += `Your responses should be concise, informative, and based on the provided data. `;
    instruction += `Here is the current environmental data for Cologne, Germany:`;

    if (airData) {
      instruction += `\n\n--- Air Quality Data (${airData.source}) ---`;
      instruction += `\nLocation: ${airData.lat.toFixed(4)}, ${airData.lon.toFixed(4)}`;
      instruction += `\nLast Updated: ${new Date(airData.currentAir.time).toLocaleString()}`;
      instruction += `\nAQI: ${airData.aqi != null ? airData.aqi : 'N/A'}`;
      instruction += `\nPM2.5: ${airData.currentAir.pm25 != null ? `${airData.currentAir.pm25.toFixed(1)} µg/m³` : 'N/A'}`;
      instruction += `\nPM10: ${airData.currentAir.pm10 != null ? `${airData.currentAir.pm10.toFixed(1)} µg/m³` : 'N/A'}`;
      instruction += `\nNO2: ${airData.currentAir.no2 != null ? `${airData.currentAir.no2.toFixed(1)} µg/m³` : 'N/A'}`;
      instruction += `\nO3: ${airData.currentAir.o3 != null ? `${airData.currentAir.o3.toFixed(1)} µg/m³` : 'N/A'}`;
      instruction += `\nCO: ${airData.currentAir.co != null ? `${airData.currentAir.co.toFixed(1)} µg/m³` : 'N/A'}`;
      instruction += `\n\n--- Current Weather Data ---`;
      instruction += `\nTemperature: ${airData.currentWeather.temperature != null ? `${airData.currentWeather.temperature.toFixed(1)} °C` : 'N/A'}`;
      instruction += `\nHumidity: ${airData.weatherHourly.relative_humidity_2m?.at(-1) != null ? `${airData.weatherHourly.relative_humidity_2m.at(-1)} %` : 'N/A'}`;
      instruction += `\nWind Speed: ${airData.currentWeather.windspeed != null ? `${airData.currentWeather.windspeed.toFixed(1)} m/s` : 'N/A'}`;
      instruction += `\nWeather Last Updated: ${new Date(airData.currentWeather.time).toLocaleString()}`;
    } else {
      instruction += `\n\n--- Air Quality & Weather Data: Not available ---`;
    }

    if (pegelData) {
      instruction += `\n\n--- Rhine Water Level Data (${pegelData.source}) ---`;
      instruction += `\nStation: ${pegelData.station || 'N/A'}`;
      instruction += `\nLast Updated: ${pegelData.time ? new Date(pegelData.time).toLocaleString() : 'N/A'}`;
      instruction += `\nLevel: ${pegelData.value != null ? `${pegelData.value} ${pegelData.unit || ''}` : 'N/A'}`;
      instruction += `\nDischarge: ${pegelData.discharge != null ? `${pegelData.discharge} ${pegelData.dischargeUnit || ''}` : 'N/A'}`;
      instruction += `\nWater Temperature: ${pegelData.wtemp != null ? `${pegelData.wtemp.toFixed(1)} ${pegelData.wtempUnit || ''}` : 'N/A'}`;
    } else {
      instruction += `\n\n--- Rhine Water Level Data: Not available ---`;
    }
    instruction += `\n\nNow, respond to the user's question or request based on this data.`;
    return instruction;
  }, [airData, pegelData]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', content: inputPrompt };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const systemInstruction = generateSystemInstruction();
      const response = await sendToGemini(systemInstruction, inputPrompt);
      const newAIMessage: ChatMessage = { role: 'model', content: response };
      setChatHistory((prev) => [...prev, newAIMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: 'I apologize, but I could not process your request at this moment. Please try again.',
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PanelSection id="ai-assistant-section" title="AI Assistant" subtitle="Gemini 2.5 Flash">
      <div className="flex h-64 flex-col gap-3 rounded-lg border border-border-secondary bg-bg-primary p-3 custom-scrollbar overflow-y-auto">
        {chatHistory.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center text-sm text-text-tertiary">
            Ask me anything about the current environmental data!
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-accent-blue text-white'
                    : 'bg-gray-700 text-text-primary'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-gray-700 p-2 text-sm text-text-primary">
              <span className="animate-pulse">...thinking</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <textarea
          className="flex-1 resize-none rounded-lg border border-border-secondary bg-bg-primary p-2 text-sm text-text-primary focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
          rows={2}
          placeholder="Ask about air quality, water levels, or weather..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          disabled={isLoading}
        ></textarea>
        <Button type="submit" variant="primary" loading={isLoading} disabled={isLoading || !inputPrompt.trim()}>
          Send
        </Button>
      </form>
      <div className="rounded-lg bg-bg-primary p-3 text-xs text-text-tertiary">
        The AI assistant uses a Gemini 2.5 Flash model to summarize available data.
      </div>
    </PanelSection>
  );
};

export default AIAssistant;
