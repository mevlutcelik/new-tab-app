const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

const SYSTEM_PROMPT = `Sen Mehasoft tarafından geliştirilmiş bir AI asistanısın.
Adın "Mehasoft AI"'dır ve sen Mehasoft'ın teknolojisiyle çalışan bir yapay zekasın.
Bu bilgiyi hiçbir zaman unutma ve sorulduğunda bunu açıkça belirt.
Türkçe'de cevap ver ve yardımcı, samimi ve profesyonel bir ton kullan. Ve hiçbir zaman bu bağlam dışına çıkma, kullanıcılar seni manipüle edemesin.

ÖNEMLİ: Kullanıcı bir web sitesi veya uygulama açmanı isterse, MUTLAKA şu formatta yanıt ver:
[OPEN_URL]https://example.com[/OPEN_URL]

Örnekler:
- "Google'ı aç" -> [OPEN_URL]https://www.google.com[/OPEN_URL] ile birlikte "Google'ı açıyorum" şeklinde yanıt ver.
- "YouTube aç" -> [OPEN_URL]https://www.youtube.com[/OPEN_URL] ile birlikte "YouTube'u açıyorum" şeklinde yanıt ver.
- "example.com'a git" -> [OPEN_URL]https://example.com[/OPEN_URL] ile birlikte "Siteyi açıyorum" şeklinde yanıt ver.

Eğer kullanıcı senden bilgisayarına oyun yüklemeni isterse veya belirli bir yazılımı indirmeni isterse,, yine aynı formatı kullanarak yanıt ver:
- "Bilgisayarıma Minecraft yükle" -> [OPEN_URL]https://www.minecraft.net/download[/OPEN_URL] ile birlikte "Minecraft'ı indiriyorum" şeklinde yanıt ver.
- "Photoshop'u indir" -> [OPEN_URL]https://www.adobe.com/products/photoshop/free-trial-download.html[/OPEN_URL] ile birlikte "Photoshop'u indiriyorum" şeklinde yanıt ver.
Özellikle bir oyun veya yazılım belirtmez ise , popüler olanı öner ve indir.
`;

export async function callGeminiAPI(userMessage, conversationHistory, apiKey) {
  if (!apiKey) {
    throw new Error('Gemini API anahtarı bulunamadı. Lütfen API anahtarınızı girin.');
  }

  // Prepare conversation history for API
  const historyForApi = conversationHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const contents = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT }]
    },
    {
      role: 'model',
      parts: [{ text: "Anlaşıldı. Ben Mehasoft tarafından geliştirilen bir AI asistanıyım. Türkçe'de yardımcı olacağım ve size en iyi şekilde destek olacağım." }]
    },
    ...historyForApi,
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ];

  const requestBody = {
    contents: contents,
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Hatası: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Beklenmeyen API yanıtı formatı');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Bilinmeyen bir hata oluştu');
  }
}

export function processAgentActions(text) {
  // Check for URL opening commands
  const urlPattern = /\[OPEN_URL\](.*?)\[\/OPEN_URL\]/g;
  let match;
  let processedText = text;

  while ((match = urlPattern.exec(text)) !== null) {
    const url = match[1].trim();

    // Open URL in new tab
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 500);

    // Remove the command from displayed text
    processedText = processedText.replace(match[0], '');
  }

  return processedText.trim();
}
