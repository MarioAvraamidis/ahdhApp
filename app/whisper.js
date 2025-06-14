export async function transcribeAudioWithWhisper(file) {
  const apiKey = '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'; // Replace with your key

  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', 'whisper-1');
  formData.append('language', 'el'); // Greek transcription

  try {
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Whisper API Error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Greek transcription:', result.text);
    return result.text;
  } catch (error) {
    console.error('Transcription failed:', error);
    return null;
  }
}
