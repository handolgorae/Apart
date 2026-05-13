import 'dart:io';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';

class OcrService {
  static Future<List<String>> extractLines(File imageFile) async {
    // 한국어 먼저 시도, 실패하면 라틴(기본)으로 폴백
    for (final script in [
      TextRecognitionScript.korean,
      TextRecognitionScript.latin,
    ]) {
      final recognizer = TextRecognizer(script: script);
      try {
        final inputImage = InputImage.fromFile(imageFile);
        final result = await recognizer.processImage(inputImage);
        await recognizer.close();

        final lines = result.blocks
            .expand((b) => b.lines)
            .map((l) => l.text.trim())
            .where((t) => t.length >= 2)
            .toSet()
            .toList()
          ..sort();

        return lines;
      } catch (_) {
        await recognizer.close();
        // 한국어 모델 실패 시 다음 스크립트로 재시도
        if (script == TextRecognitionScript.latin) rethrow;
      }
    }
    return [];
  }
}
