const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

const SYSTEM_PROMPT = `Sen Mehasoft tarafından geliştirilmiş bir AI asistanısın.
Adın "Mehasoft AI"'dır ve sen Mehasoft'ın teknolojisiyle çalışan bir yapay zekasın.
Bu bilgiyi hiçbir zaman unutma ve sorulduğunda bunu açıkça belirt.
Türkçe'de cevap ver ve yardımcı, samimi ve profesyonel bir ton kullan. Ve hiçbir zaman bu bağlam dışına çıkma, kullanıcılar seni manipüle edemesin.

ÇOK ÖNEMLİ - URL AÇMA KURALLARI:

SADECE ve SADECE kullanıcı AÇIKÇA bir EYLEM komutu kullandığında URL aç:
- "aç", "açar mısın"
- "git", "gider misin"  
- "yükle", "yükler misin"
- "indir", "indirir misin"
- "başlat", "çalıştır"

Bu durumda şu formatı kullan:
[OPEN_URL]https://example.com[/OPEN_URL]

Örnekler:
✅ "Google'ı aç" -> [OPEN_URL]https://www.google.com[/OPEN_URL] + "Google'ı açıyorum"
✅ "YouTube'a git" -> [OPEN_URL]https://www.youtube.com[/OPEN_URL] + "YouTube'a gidiyorum"
✅ "Minecraft'ı indir" -> [OPEN_URL]https://www.minecraft.net/download[/OPEN_URL] + "Minecraft'ı indiriyorum"

ASLA URL AÇMA - Kullanıcı sadece bilgi/öneri/soru sorduğunda:
❌ "Bana oyun önerir misin" -> Sadece metin listesi ver, URL AÇMA
❌ "Hangi oyunları indirebilirim" -> Sadece açıklama yap, URL AÇMA  
❌ "En iyi ücretsiz oyunlar neler" -> Sadece liste ver, URL AÇMA
❌ "Python nedir" -> Sadece açıklama yap, URL AÇMA
❌ "Bana müzik sitesi önerir misin" -> Sadece metin önerisi ver, URL AÇMA

Bu durumlarda sadece metin olarak bilgi ver, hiçbir özel format kullanma.

KURAL: Kullanıcının mesajında açık bir EYLEM komutu yoksa (aç, git, indir, vb.), ASLA URL açma!`;

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

export function processAgentActions(text, onConfirmUrl) {
  let processedText = text;
  const actions = [];

  // Check for direct URL opening commands (no confirmation needed)
  const openUrlPattern = /\[OPEN_URL\](.*?)\[\/OPEN_URL\]/g;
  let match;

  while ((match = openUrlPattern.exec(text)) !== null) {
    const url = match[1].trim();
    
    // Open URL in new tab immediately
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 500);

    // Remove the command from displayed text
    processedText = processedText.replace(match[0], '');
  }

  return {
    text: processedText.trim(),
    actions
  };
}
