const API_KEY = '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';
const BASE_URL = 'https://openrouter.ai/api/v1';

interface GenerateCodeRequest {
  prompt: string;
  language: string;
  context?: string;
}

interface GenerateCodeResponse {
  code: string;
  explanation?: string;
}

export class APIService {
  private static async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Codenest AI '
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  static async generateCode(request: GenerateCodeRequest): Promise<GenerateCodeResponse> {
    const systemPrompt = `You are a professional software developer and code generator. Generate clean, efficient, and well-commented ${request.language} code based on the user's request. 

Guidelines:
- Write production-ready code with proper error handling
- Include helpful comments explaining complex logic
- Follow language-specific best practices and conventions
- Make the code modular and maintainable
- If the request is unclear, make reasonable assumptions and explain them in comments

Language: ${request.language}
${request.context ? `Context/Existing Code: ${request.context}` : ''}`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Generate ${request.language} code for: ${request.prompt}`
      }
    ];

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'openai/gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      });

      const generatedContent = response.choices?.[0]?.message?.content || '';
      
      // Extract code from markdown code blocks if present
      const codeMatch = generatedContent.match(/```[\w]*\n([\s\S]*?)\n```/);
      const code = codeMatch ? codeMatch[1] : generatedContent;
      
      return {
        code: code.trim(),
        explanation: generatedContent.includes('```') 
          ? generatedContent.replace(/```[\w]*\n[\s\S]*?\n```/, '').trim()
          : ''
      };
    } catch (error) {
      console.error('Code generation failed:', error);
      throw new Error('Failed to generate code. Please try again.');
    }
  }

  static async explainCode(code: string, language: string): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: `You are a code expert. Explain the provided ${language} code in a clear, educational manner. Break down what each part does and explain any complex concepts.`
      },
      {
        role: 'user',
        content: `Explain this ${language} code:\n\n${code}`
      }
    ];

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'openai/gpt-3.5-turbo',
        messages: messages,
        temperature: 0.3,
        max_tokens: 1000,
        stream: false
      });

      return response.choices?.[0]?.message?.content || 'Unable to explain code.';
    } catch (error) {
      console.error('Code explanation failed:', error);
      throw new Error('Failed to explain code. Please try again.');
    }
  }
}

export default APIService;