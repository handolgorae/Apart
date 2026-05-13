import 'dart:io';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';

class OcrService {
  static final _recognizer =
      TextRecognizer(script: TextRecognitionScript.korean);

  /// 이미지에서 텍스트 라인 목록을 추출합니다.
  static Future<List<String>> extractLines(File imageFile) async {
    final inputImage = InputImage.fromFile(imageFile);
    final result = await _recognizer.processImage(inputImage);

    final lines = result.blocks
        .expand((b) => b.lines)
        .map((l) => l.text.trim())
        .where((t) => t.length >= 2)
        .toSet()
        .toList()
      ..sort();

    return lines;
  }

  static void dispose() => _recognizer.close();
}
