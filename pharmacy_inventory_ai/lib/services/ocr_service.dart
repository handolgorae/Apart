import 'dart:io';

class OcrService {
  // OCR 기능은 추후 안정화 후 추가 예정
  // 현재는 빈 리스트 반환 → 사용자가 직접 입력
  static Future<List<String>> extractLines(File imageFile) async {
    return [];
  }
}
