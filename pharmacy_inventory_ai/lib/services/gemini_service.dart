import 'dart:convert';
import 'dart:io';
import 'package:google_generative_ai/google_generative_ai.dart';
import '../config/api_config.dart';

class GeminiMedicineResult {
  final String name;
  final int quantity;
  GeminiMedicineResult({required this.name, required this.quantity});
}

class GeminiService {
  static final _model = GenerativeModel(
    model: 'gemini-2.0-flash-lite',
    apiKey: ApiConfig.geminiApiKey,
  );

  static const _prompt = '''
이 약국 선반/약 사진을 분석해줘.
1. 보이는 약품명을 모두 추출해줘 (브랜드명, 제품명 포함)
2. 각 약의 수량(개수)을 추정할 수 있으면 포함해줘

반드시 아래 JSON 형식으로만 답해줘 (다른 텍스트 없이):
{"medicines":[{"name":"약품명","quantity":5},{"name":"약품명2","quantity":0}]}

quantity를 알 수 없으면 0으로 설정해줘.
''';

  static Future<List<GeminiMedicineResult>> analyze(File imageFile) async {
    final imageBytes = await imageFile.readAsBytes();
    final content = [
      Content.multi([
        TextPart(_prompt),
        DataPart('image/jpeg', imageBytes),
      ])
    ];

    final response = await _model.generateContent(content);
    final text = response.text ?? '';

    // JSON 파싱
    final jsonMatch = RegExp(r'\{.*\}', dotAll: true).firstMatch(text);
    if (jsonMatch == null) return [];

    final decoded = jsonDecode(jsonMatch.group(0)!) as Map<String, dynamic>;
    final list = decoded['medicines'] as List<dynamic>? ?? [];

    return list
        .map((e) => GeminiMedicineResult(
              name: e['name'] as String? ?? '',
              quantity: (e['quantity'] as num?)?.toInt() ?? 0,
            ))
        .where((e) => e.name.isNotEmpty)
        .toList();
  }
}
