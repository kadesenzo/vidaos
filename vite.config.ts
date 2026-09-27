import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-server',
    configureServer(server) {
      server.middlewares.use('/api/ai/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { prompt, context } = JSON.parse(body || '{}');

            if (!process.env.GEMINI_API_KEY) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                text: "Assistente Life OS conectado em modo local. Para respostas completas e geração de simulados via IA generativa, certifique-se de configurar sua chave no painel de Secrets.",
                isLocal: true,
              }));
              return;
            }

            const ai = new GoogleGenAI({
              apiKey: process.env.GEMINI_API_KEY,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const systemInstruction = `Você é o LIFE AI TUTOR & ASSISTENTE DO LIFE OS, um Personal Operating System moderno com estética iOS 26.
Você atua como orientador de estudos, segundo cérebro e assistente de produtividade.
REGRAS FUNDAMENTAIS:
1. Responda SEMPRE com base nos dados reais do usuário fornecidos no CONTEXTO (estudos, matérias, tarefas, rotina, projetos, finanças).
2. NUNCA invente dados fictícios quando perguntado sobre a rotina ou status do usuário.
3. Se o usuário pedir para organizar o dia, sugira a próxima prioridade com clareza objetiva (estilo Apple: direto, encorajador, sem enrolação).
4. Ao explicar matérias ou conceitos de estudo, seja didático, forneça exemplos claros e destaque mnemônicos ou passos práticos.
5. Fale em português do Brasil com tom premium, profissional e prestativo.`;

            const fullPrompt = `CONTEXTO REAL DO USUÁRIO NO LIFE OS:
${context ? JSON.stringify(context, null, 2) : 'Nenhum dado adicional fornecido.'}

SOLICITAÇÃO DO USUÁRIO:
${prompt}`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: fullPrompt,
              config: {
                systemInstruction,
              },
            });

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ text: response.text }));
          } catch (err: any) {
            console.error('Gemini API Server Error:', err);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Erro ao processar com Gemini' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

